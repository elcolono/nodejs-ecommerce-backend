const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const vendorSchema = new mongoose.Schema(
    {
        slug: {
            type: String,
            unique: true,
            index: true
        },
        user: {
            type: ObjectId,
            ref: 'User',
            index: true
        },
        title: {
            type: String,
            trim: true,
            min: 3,
            max: 160,
            required: true
        },
        email: {
            type: String,
            trim: true,
            required: true
        },
        phone: {
            type: String,
            trim: true,
            required: true
        },
        street: {
            type: String,
            trim: true,
            required: true
        },
        street2: {
            type: String,
            trim: true
        },
        city: {
            type: String,
            trim: true,
            required: true
        },
        zipcode: {
            type: String,
            trim: true,
            required: true
        },
        country: {
            type: String,
            trim: true,
            required: true
        },
        about: {
            type: String,
            trim: true,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Vendor', vendorSchema);
