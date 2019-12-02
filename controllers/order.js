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
    // console.log(req.body);
    const { guest, buyer, amount, billing, transactionId, products } = req.body;

    let savedVendorOrders = [];

    function getTotalAmount(products) {
        var totalAmount = 0;
        products.map(product => {
            totalAmount += product.price * product.count;
        });
        return totalAmount;
    }

    function sortProductsByVendors(products) {
        // Sort orders by vendors
        const productsByVendor = [];

        products.map(item => {
            let found = productsByVendor.find((o, i) => {
                if (o.vendor._id === item.vendor._id) {
                    productsByVendor[i].products.push(item);
                    return true; // stop searching
                }
            });
            if (!found) {
                const createOrderData = {
                    vendor: item.vendor,
                    products: [item]
                };
                productsByVendor.push(createOrderData);
            }
        });
        return productsByVendor;
    }

    function saveOrderForVendor(item) {
        const orderVendorData = {
            vendor: item.vendor._id,
            buyer: buyer,
            guest: guest,
            products: item.products,
            billing: billing,
            transactionId: transactionId,
            amount: getTotalAmount(item.products)
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
                    resolve(err);
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

    const promises = sortProductsByVendors(products).map(item =>
        saveOrderForVendor(item)
    );
    // promises.push(saveOrderForBuyer());
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
