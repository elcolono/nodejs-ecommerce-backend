const { check } = require("express-validator");

exports.userSignupValidator = [
    check("firstname")
        .not()
        .isEmpty()
        .withMessage("Firstname is required"),
    check("lastname")
        .not()
        .isEmpty()
        .withMessage("Lastname is required"),
    check("email")
        .not()
        .isEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Must be a valid email address"),
    check("password")
        .not()
        .isEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    check("confirmPassword")
        .not()
        .isEmpty()
        .withMessage("Confirm password is required")
        .isLength({ min: 6 })
        .withMessage("Confirm password must be at least 6 characters long")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Password confirmation does not match password");
            }
            // Indicates the success of this synchronous custom validator
            return true;
        })
];

exports.userSigninValidator = [
    check("email")
        .not()
        .isEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Must be a valid email address"),
    check("password")
        .not()
        .isEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
];

exports.forgotPasswordValidator = [
    check("email")
        .not()
        .isEmpty()
        .isEmail()
        .withMessage("Must be a valid email address")
];

exports.resetPasswordValidator = [
    check("newPassword")
        .not()
        .isEmpty()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
];
