const FILENAME_DJI_PANO = /^pano_[^_]+_\d{7}_\d{13}$/;
const FILENAME_IOS_BROKEN_EXIF = /^\d{8}_\d{9}_iOS$/;
const FILENAME_BROKEN_EXIF = /^\d{4}-\d{2}-\d{2} \d{2}-\d{2}-\d{2}$/;
const FILENAME_PIXEL_RESULT = /^result_\d{13}$/;
const FILENAME_CAMERA_360 = /^Camera360_\d{4}_\d{1,2}_\d{1,2}_\d{6}$/;
const FILENAME_6_TAG = /^6tag_\d{6}-\d{6}/;

const d2 = (d) => `0${d}`.slice(-2);

const buildName = (Y, M, D, h, m, s) => `${Y}.${M}.${D} ${h}.${m}.${s}`;

const dateToName = (date) => {
    return buildName(
        date.getFullYear(),
        d2(date.getMonth() + 1),
        d2(date.getDate()),
        d2(date.getHours()),
        d2(date.getMinutes()),
        d2(date.getSeconds()),
    );
};

module.exports = function nameTreats(name) {
    switch (true) {
        case FILENAME_DJI_PANO.test(name):
        case FILENAME_PIXEL_RESULT.test(name):
            return dateToName(new Date(Number(name.split('_').pop())));
        case FILENAME_IOS_BROKEN_EXIF.test(name):
            return buildName(
                name.slice(0, 4),
                name.slice(4, 6),
                name.slice(6, 8),
                name.slice(9, 11),
                name.slice(11, 13),
                name.slice(13, 15),
            );
        case FILENAME_BROKEN_EXIF.test(name):
            return name.replace(/-/g, '.');
        case FILENAME_CAMERA_360.test(name):
            const [Y, M, D, hms] = name.slice(10).split('_');

            return buildName(Y, d2(M), d2(D), hms.slice(0, 2), hms.slice(2, 4), hms.slice(4, 6));

        case FILENAME_6_TAG.test(name):
            return buildName(
                '20' + name.slice(9, 11),
                name.slice(7, 9),
                name.slice(5, 7),
                name.slice(12, 14),
                name.slice(14, 16),
                name.slice(16, 18),
            );
    }

    return false;
};
