const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;


const OrderBuyerSchema = new mongoose.Schema(
  {
    buyer: { type: ObjectId, ref: "User" },
    products: [{ type: ObjectId, ref: "orderVendor" }],
    transaction_id: String,
    amount: Number,
    address: { type: String, required: true },
    updated: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderBuyer", OrderBuyerSchema);

// module.exports = { Order, CartItem };
