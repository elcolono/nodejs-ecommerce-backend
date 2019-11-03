const OrderBuyer = require("../models/orderBuyer");
const OrderVendor = require("../models/orderVendor");
const { errorHandler } = require("../helpers/dbErrorHandler");
const mongoose = require("mongoose");

exports.orderById = (req, res, next, id) => {
    OrderVendor.findById(id)
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
    // Reveived orderData:
    // {
    //     buyer: userId,
    //     amount: response.transaction.amount,
    //     address: deliveryAddress,
    //     transaction_id: response.transaction.id,
    //     productsByVendor: productsByVendor
    // }

    const {
        buyer,
        amount,
        billing,
        transaction_id,
        productsByVendor
    } = req.body.orderData;

    let savedVendorOrders = [];

    function getTotalAmount(products) {
        var totalAmount = 0;
        products.map(product => {
            totalAmount += product.price * product.count;
        });
        return totalAmount;
    }

    function saveOrderForVendor(product) {
        const orderVendorData = {
            vendor: product.vendor._id,
            buyer: buyer,
            products: product.products,
            billing: billing,
            transaction_id: transaction_id,
            amount: getTotalAmount(product.products)
        };

        const id = new mongoose.Types.ObjectId();
        savedVendorOrders.push(id);
        const orderVendor = new OrderVendor({
            ...orderVendorData,
            _id: id
        });
        return new Promise((resolve, reject) => {
            orderVendor.save((err, saved) => {
                if (err) {
                    reject(err);
                }
                resolve(saved);
            });
        });
    }

    function saveOrderForBuyer() {
        const orderBuyerData = {
            buyer: buyer,
            products: savedVendorOrders,
            transaction_id: transaction_id,
            amount: amount,
            billing: billing
        };

        orderBuyer = new OrderBuyer(orderBuyerData);
        return new Promise((resolve, reject) => {
            orderBuyer.save((err, saved) => {
                if (err) {
                    reject(err);
                }
                resolve(saved);
            });
        });
    }

    const promises = productsByVendor.map(product =>
        saveOrderForVendor(product)
    );
    promises.push(saveOrderForBuyer());
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

exports.listOrdersVendor = (req, res) => {
    OrderVendor.find({ vendor: req.profile._id })
        .populate("buyer", ["name", "email"])
        .select("-transaction_id")
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
    res.json(OrderVendor.schema.path("status").enumValues);
};

exports.updateOrderStatus = (req, res) => {
    OrderVendor.update(
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
