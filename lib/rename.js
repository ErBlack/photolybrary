const util = require('util');
const glob = util.promisify(require('glob'));
const exif = require('./exif');
const nameTreats = require('./nameTreats');

const {
    dirname,
    extname,
    basename
} = require('path');
const fs = require('fs');

const rename = util.promisify(fs.rename);
const readFile = util.promisify(fs.readFile);

const base64Prefix = (file) => `data:image/jpeg;base64,${file}`;

const CORRECT_NAME_REGEXP = /^\d{4}\.\d{2}.\d{2} \d{2}.\d{2}.\d{2}$/;

function getFileName(exifData) {
    try {
        const {
            exif: {CreateDate: dateString}
        } = exifData;


        const [date, time] = dateString.split(' ');
        const [Y, M, D] = date.split(':');
        const [h, m, s] = time.split(':');

        return `${Y}.${M}.${D} ${h}.${m}.${s}`;
    } catch (e) {
        throw new Error('Unable to get EXIF date');
    }
}


module.exports = async function exec(path, dryRun) {
    const list = await glob(path);

    const result = await Promise.all(list.map(async (oldPath) => {
        const dir = dirname(oldPath);
        const ext = extname(oldPath);
        const name = basename(oldPath, ext);

        if (CORRECT_NAME_REGEXP.test(name)) {
            process.stdout.write(`SKIP: ${basename(oldPath)}\n`);
            return true;
        }

        let newName = false;
        let error;

        try {
            const exifData = await exif(oldPath);

            console.log(JSON.stringify(exifData,0, 4));

            newName = getFileName(exifData);
        } catch (e) {
            newName = nameTreats(name);

            error = e.message;
        }

        if (!newName) {
            process.stderr.write(`FAILED: ${basename(oldPath)} ${error}\n`)
            return false;
        }

        const newPath = `${dir}/${newName}${ext.toLocaleLowerCase()}`;

        if (!dryRun) await rename(oldPath, newPath);

        process.stdout.write(`SUCCESS: ${basename(oldPath)} → ${basename(newPath)}\n`);
        return true;
    }));

    const success = result.filter(Boolean).length;
    const failed = result.length - success;

    process.stdout.write(`success: ${success}, failed: ${failed}\n`);
}
