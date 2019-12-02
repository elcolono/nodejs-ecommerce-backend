const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isVendor, isAdmin } = require("../controllers/auth");
const { userById, addOrderToUserHistory } = require("../controllers/user");
const {
    create,
    listOrders,
    getStatusValues,
    orderById,
    updateOrderStatus,
    listOrdersVendor
} = require("../controllers/order");
const { decreaseQuantity } = require("../controllers/product");

router.post(
    "/order/create/:userId",
    requireSignin,
    isAuth,
    // addOrderToUserHistory,
    // decreaseQuantity,
    create
);
router.post(
    "/order/create/",
    // addOrderToUserHistory,
    // decreaseQuantity,
    create
);

router.get("/order/list/:userId", requireSignin, isAuth, isAdmin, listOrders);
router.get("/order/vendor/list/:userId", requireSignin, isAuth, isVendor, listOrdersVendor);
router.get(
    "/order/status-values/:userId",
    requireSignin,
    isAuth,
    isVendor,
    getStatusValues
);
router.put(
    "/order/:orderId/status/:userId",
    requireSignin,
    isAuth,
    isVendor,
    updateOrderStatus
);

router.param("userId", userById);
router.param("orderId", orderById);

module.exports = router;
