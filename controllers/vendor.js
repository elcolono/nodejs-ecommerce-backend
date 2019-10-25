const Vendor = require("../models/vendor");

exports.update = (req, res) => {
    req.body.user = req.profile;

    options = { upsert: true, new: true, setDefaultsOnInsert: true };
    Vendor.findOneAndUpdate(
        { _id: req.profile._id },
        { $set: req.body },
        options,
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: "You are not authorized to perform this action"
                });
            }
            res.json(user);
        }
    );
};
