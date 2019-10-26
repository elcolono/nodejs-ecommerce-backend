const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ItemSchema = new mongoose.Schema(
    {
        product: { type: ObjectId, ref: "Product" },
        name: String,
        price: Number,
        count: Number,
        user: Object
    },
    { timestamps: true }
);

const saleSchema = new mongoose.Schema(
    {
        vendor: { type: ObjectId, ref: "User" },
        buyer: { type: ObjectId, ref: "User" },
        items: [ItemSchema],
        amount: Number,
        status: {
            type: String,
            default: "Not processed",
            enum: [
                "Not processed",
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled"
            ] // enum means string objects
        },
        updated: Date,
        address: String
    },
    { timestamps: true }
);

module.exports = mongoose.model("Sale", saleSchema);
