const { promisify } = require('util');
const sizeOf = promisify(require('image-size'));
const fs = require('fs');

const unlink = promisify(fs.unlink);

module.exports = async function exec(paths, dryRun) {
    const result = await Promise.all(
        paths.map(async (path) => {
            return sizeOf(path)
                .then(({ width, height }) => {
                    if (Math.abs(width - height) < 2) {
                        process.stdout.write(`Drop:  ${path}\n`);

                        if (!dryRun) {
                            return unlink(path).then(() => true);
                        }
                    }

                    return true;
                })
                .catch((err) => {
                    process.stderr.write(`Error: ${path} ${err.message}\n`);

                    return false;
                });
        }),
    );

    const success = result.filter(Boolean).length;
    const failed = result.length - success;

    process.stdout.write(`success: ${success}, failed: ${failed}\n`);
};
