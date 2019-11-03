const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;


const BillingAddress = new mongoose.Schema(
  {
      firstname: { type: String, required: true },
      lastname: { type: String, required: true },
      company: String,
      addressline1: { type: String, required: true },
      addressline2: String,
      state: { type: String, required: true },
      postcode: { type: String, required: true },
      country: { type: String, required: true },
  },  
  { timestamps: true }
);

const OrderBuyerSchema = new mongoose.Schema(
  {
    buyer: { type: ObjectId, ref: "User" },
    products: [{ type: ObjectId, ref: "orderVendor" }],
    transaction_id: String,
    amount: Number,
    billing: BillingAddress,
    updated: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderBuyer", OrderBuyerSchema);

// module.exports = { Order, CartItem };
