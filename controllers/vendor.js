const Vendor = require("../models/vendor");
const formidable = require("formidable");
const fs = require("fs");
const { errorHandler } = require("../helpers/dbErrorHandler");
const _ = require("lodash");

// exports.vendorById = (req, res, next, id) => {
//     Vendor.findById(id)
//         .populate("user")
//         .exec((err, vendor) => {
//             if (err || !vendor) {
//                 return res.status(400).json({
//                     error: "Vendor not found"
//                 });
//             }
//             req.vendor = vendor;
//             next();
//         });
// };

exports.read = (req, res) => {
    Vendor.findById(req.profile._id)
    .select("-photo")
    .populate("user", ["name", "email"])
    .exec((err, vendor) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(vendor);
    });
};

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }
        // check for all fields
        const { about } = fields;

        if (!about) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        fields.user = req.profile;
        if (files.photo) {
            // console.log("FILES PHOTO: ", files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size"
                });
            }
            fields.photo.data = fs.readFileSync(files.photo.path);
            fields.photo.contentType = files.photo.type;
        }

        options = { upsert: true, new: true, setDefaultsOnInsert: true };
        Vendor.findOneAndUpdate(
            { user: req.profile },
            { $set: fields },
            options,
            (err, vendor) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json(vendor);
            }
        );
    });
};
