const multer = require('multer');
const fs = require('fs');
const slugify = require('slugify');
const shortId = require('shortid');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const vendorId = req.params.userId;
        console.log(vendorId);
        const dir = `./images/${vendorId}`;
        fs.exists(dir, exist => {
            if (!exist) {
                return fs.mkdir(dir, error => cb(error, dir));
            }
            cb(null, dir);
        });
    },
    filename: (req, file, cb) => {
        console.log(file);
        const { name } = req.body;
        const imageId = shortId.generate();

        slug = slugify(name).toLowerCase();

        cb(null, slug + '-' + imageId + '.png');
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
// fileStorage
exports.uploadImages = multer({ storage: fileStorage, fileFilter: fileFilter }).array('images');
