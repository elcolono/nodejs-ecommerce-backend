const express = require("express");
const router = express.Router();
const {
    signup,
    signin,
    signout,
    requireSignin,
    forgotPassword,
    resetPassword
} = require("../controllers/auth");

// validators
const { runValidation } = require("../validator");
const {
    userSignupValidator,
    userSigninValidator,
    forgotPasswordValidator,
    resetPasswordValidator
} = require("../validator/auth");

router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/signin/:role", userSigninValidator, runValidation, signin);
router.get("/signout", signout);
router.put(
    "/forgot-password",
    forgotPasswordValidator,
    runValidation,
    forgotPassword
);
router.put(
    "/reset-password",
    resetPasswordValidator,
    runValidation,
    resetPassword
);

module.exports = router;
