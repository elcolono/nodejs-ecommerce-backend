const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isVendor } = require("../controllers/auth");

const { userById } = require("../controllers/user");
const { create, update, vendorById } = require("../controllers/vendor");

router.put("/vendor/:userId", requireSignin, isAuth, isVendor, update);
// router.post("/vendor/:userId", requireSignin, isAuth, isVendor, create);

router.param("userId", userById);
router.param("vendorId", vendorById);

module.exports = router;
