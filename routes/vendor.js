const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isVendor } = require("../controllers/auth");

const { userById } = require("../controllers/user");
const { read, update } = require("../controllers/vendor");

router.put("/vendor/:userId", requireSignin, isAuth, isVendor, update);
// router.get("/vendor/:userId", requireSignin, isAuth, isVendor, read);

router.param("userId", userById);

module.exports = router;
