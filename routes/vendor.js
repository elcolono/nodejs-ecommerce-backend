const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isVendor } = require("../controllers/auth");

const { userById } = require("../controllers/user");
const { read, update, listProducts } = require("../controllers/vendor");

router.get("/vendor/:userId", read);
router.put("/vendor/:userId", requireSignin, isAuth, isVendor, update);
router.get("/vendor/products/:userId", listProducts);


router.param("userId", userById);
// router.param("vendorId", vendorById);

module.exports = router;
