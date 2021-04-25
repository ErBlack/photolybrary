const ExifImage = require('exif').ExifImage;

module.exports = (image) => new Promise((resolve, reject) => {
    try {
        new ExifImage({ image }, function (error, data) {
            if (error) {
                reject(error);
            } else {
                resolve(data)
            }
        });
    } catch (error) {
        reject(error);
    }
});
