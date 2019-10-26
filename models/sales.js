const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema(
    {
        product: { type: ObjectId, ref: "Product" },
        name: String,
        price: Number,
        count: Number,
        seller: { type: ObjectId, ref: "User" },
        buyer: { type: ObjectId, ref: "User" },
      },
      { timestamps: true }
);

module.exports = mongoose.model("Sales", salesSchema);
