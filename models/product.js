const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
    {
        vendor: { type: ObjectId, ref: 'User' },
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
            unique: true
        },
        description: {
            type: String,
            required: true,
            maxlength: 2000
        },
        price: {
            type: Number,
            trim: true,
            required: true,
            maxlength: 32
        },
        category: {
            type: ObjectId,
            ref: 'Category',
            required: true
        },
        quantity: {
            type: Number
        },
        images: {
            type: [String],
            required: true
        },
        shippingTo: {
            type: [String],
            required: true
        },
        sold: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
