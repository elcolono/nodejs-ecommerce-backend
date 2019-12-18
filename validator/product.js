const { check } = require('express-validator');

exports.createProductValidator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Product Name is required'),
    check('description')
        .not()
        .isEmpty()
        .withMessage('Description is required'),
    check('price')
        .not()
        .isEmpty()
        .withMessage('Price is required')
        .isNumeric()
        .withMessage('Price must be a number'),
    check('category')
        .not()
        .isEmpty()
        .withMessage('Category is required'),
    check('shippingTo')
        .not()
        .isEmpty()
        .withMessage('Shipping to is required')
];
