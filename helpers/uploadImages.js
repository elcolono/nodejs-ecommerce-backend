const multer = require('multer');
const fs = require('fs');

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
        cb(null, new Date().toISOString() + '-' + file.originalname);
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
