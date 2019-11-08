const Vendor = require("../models/vendor");
const Product = require("../models/product");
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
    Vendor.findOne({ user: req.profile._id })
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

exports.photo = (req, res) => {
    Vendor.findOne({ user: req.profile._id })
        .select("photo")
        .exec((err, vendor) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            if (vendor.photo.data) {
                res.set("Content-Type", vendor.photo.contentType);
                return res.send(vendor.photo.data);
            }
        });
};

exports.list = (req, res) => {
    Vendor.find()
        .select("-photo")
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};

exports.listProducts = (req, res) => {
    console.log(req.profile._id);
    Product.find({ vendor: req.profile._id })
        .select("-photo")
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(products);
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
            fields.photo = {};
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
