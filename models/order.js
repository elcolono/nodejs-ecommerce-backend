const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

// const CartItemSchema = new mongoose.Schema(
//   {
//     product: { type: ObjectId, ref: "Product" },
//     name: String,
//     price: Number,
//     count: Number,
//     user: Object
//   },
//   { timestamps: true }
// );

// const CartItem = mongoose.model("CartItem", CartItemSchema);

const OrderSchema = new mongoose.Schema(
  {
    orderer: { type: ObjectId, ref: "User" },
    orders: [{ type: ObjectId, ref: "Sale" }],
    transaction_id: {},
    amount: { type: Number },
    address: String,
    updated: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);

// module.exports = { Order, CartItem };
