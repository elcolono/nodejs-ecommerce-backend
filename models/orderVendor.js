const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ProductSchema = new mongoose.Schema(
    {
        product: { type: ObjectId, ref: "Product" },
        name: String,
        price: Number,
        count: Number,
        user: Object
    },
    { timestamps: true }
);

const OrderVendorSchema = new mongoose.Schema(
    {
        vendor: { type: ObjectId, ref: "User" },
        buyer: { type: ObjectId, ref: "User" },
        products: [ProductSchema],
        amount: Number,
        address: { type: String, required: true },
        transaction_id: String,
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
        updated: Date
    },
    { timestamps: true }
);

module.exports = mongoose.model("OrderVendor", OrderVendorSchema);
