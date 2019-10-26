const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const saleSchema = new mongoose.Schema(
    {
        product: { type: ObjectId, ref: "Product" },
        name: String,
        price: Number,
        count: Number,
        user: { type: ObjectId, ref: "User" }
        // buyer: { type: ObjectId, ref: "User" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Sale", saleSchema);
