const { promisify } = require('util')
const sizeOf = promisify(require('image-size'))
const glob = promisify(require('glob'));
const fs = require('fs');

const unlink = promisify(fs.unlink);

module.exports = async function exec(path, dryRun) {
    const list = await glob(path);

    const result = await Promise.all(list.map(async (path) => {
        return sizeOf(path)
            .then(({width, height}) => {
                if (width === height) {
                    process.stdout.write(`Drop:  ${path}\n`);

                    if (!dryRun) {
                        return unlink(path).then(() => true);
                    }
                }

                return true;
            })
            .catch(err => {
                process.stderr.write(`Error: ${path} ${err.message}\n`)

                return false;
            })
    }));

    const success = result.filter(Boolean).length;
    const failed = result.length - success;

    process.stdout.write(`success: ${success}, failed: ${failed}\n`);
}
