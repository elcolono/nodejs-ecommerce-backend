const express = require("express");
const router = express.Router();
const {
    signup,
    signin,
    signout,
    requireSignin
} = require("../controllers/auth");

// validators
const { runValidation } = require('../validator');
const { userSignupValidator, userSigninValidator } = require("../validator/auth");

router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/signin/:role", userSigninValidator, runValidation, signin);
router.get("/signout", signout);

module.exports = router;
