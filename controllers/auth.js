const User = require("../models/user");
const jwt = require("jsonwebtoken"); // to generate signed token
const expressJwt = require("express-jwt"); // for authorization check
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.signup = (req, res) => {
    // console.log("req.body", req.body);
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        });
    });
};

exports.signin = (req, res) => {
    // find the user based on email
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User with that email does not exist. Please signup"
            });
        }
        if (req.params.role == "vendor" && user.role !== 1) {
            return res.status(401).json({
                error: "Sorry, you have no Vendor Permissions. Please register!"
            });
        }
        // if user is found make sure the email and password match
        // create authenticate method in user model
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password dont match"
            });
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '3600' });
        res.cookie('token', token, { expiresIn: '3600' });

        const { _id, firstname, lastname, email, role } = user;
        return res.json({
            token,
            user: { _id, firstname, lastname, email, role },
            expiresIn: 3600
        });
    });
};

exports.signout = (req, res) => {
    res.clearCookie("t");
    res.json({ message: "Signout success" });
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});

exports.isAuth = (req, res, next) => {
    console.log(req.profile._id);
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            error: "Access denied"
        });
    }
    next();
};

exports.isVendor = (req, res, next) => {
    if (req.profile.role !== 1) {
        return res.status(403).json({
            error: "Vendor resourse! Access denied"
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role !== 9089) {
        return res.status(403).json({
            error: "Admin resourse! Access denied"
        });
    }
    next();
};
