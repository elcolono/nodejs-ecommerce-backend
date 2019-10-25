const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const vendorSchema = new mongoose.Schema(
    {
        user: {
            type: ObjectId,
            ref: "User"
        },
        about: {
            type: String,
            trim: true,
            required: true
        },
        photo: {
            data: Buffer,
            contentType: String
        }
        // products: [{ type: ObjectId, ref: "Product" }]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);
