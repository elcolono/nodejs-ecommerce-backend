const { Order, CartItem } = require("../models/order");
const { errorHandler } = require("../helpers/dbErrorHandler");
const Sale = require("../models/sale");
const mongoose = require("mongoose");

exports.orderById = (req, res, next, id) => {
    Order.findById(id)
        .populate("products.product", "name price")
        .exec((err, order) => {
            if (err || !order) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            req.order = order;
            next();
        });
};

exports.create = async (req, res) => {
    // convert callback `save` function to promise based
    let savedProducts = [];

    function saveSales(product) {
        const id = new mongoose.Types.ObjectId();
        savedProducts.push(id);
        const sale = new Sale({
            ...product,
            _id: id
        });
        return new Promise((resolve, reject) => {
            sale.save((err, saved) => {
                if (err) {
                    reject(err);
                }
                resolve(saved);
            });
        });
    }

    function saveOrder() {
        let order = req.body.order;
        order.products = savedProducts;
        order = new Order(order);
        return new Promise((resolve, reject) => {
            order.save((err, saved) => {
                if (err) {
                    reject(err);
                }
                resolve(saved);
            });
        });
    }

    const products = req.body.order.products;
    const promises = products.map(product => saveSales(product));
    promises.push(saveOrder());
    return Promise.all(promises).then(responses => {
        // all saved processes are finished
        res.json(responses);
    });
};

exports.listOrders = (req, res) => {
    Order.find()
        .populate("user", "_id name address")
        .sort("-created")
        .exec((err, orders) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(error)
                });
            }
            res.json(orders);
        });
};

exports.getStatusValues = (req, res) => {
    res.json(Order.schema.path("status").enumValues);
};

exports.updateOrderStatus = (req, res) => {
    Order.update(
        { _id: req.body.orderId },
        { $set: { status: req.body.status } },
        (err, order) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(order);
        }
    );
};
