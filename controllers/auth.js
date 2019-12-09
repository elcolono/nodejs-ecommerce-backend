const User = require("../models/user");
const shortId = require("shortid");
const jwt = require("jsonwebtoken"); // to generate signed token
const expressJwt = require("express-jwt"); // for authorization check
const { errorHandler } = require("../helpers/dbErrorHandler");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
// sendgrid
const sgMail = require("@sendgrid/mail"); // SENDGRID_API_KEY
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.preSignup = (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (user) {
            return res.status(400).json({
                error: "Email is taken"
            });
        }
        const token = jwt.sign({ firstname, lastname, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: "10m" });

        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Account activation link`,
            html: `
            <p>Please use the following link to activate your acccount:</p>
            <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
            <hr />
            <p>This email may contain sensetive information</p>
            <p>https://seoblog.com</p>
        `
        };

        sgMail.send(emailData).then(sent => {
            return res.json({
                message: `Email has been sent to ${email}. Follow the instructions to activate your account.`
            });
        });
    });
};

exports.signup = (req, res) => {
    const token = req.body.token;
    if (token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded) {
            if (err) {
                return res.status(401).json({
                    error: "Expired link. Please signup again."
                });
            }
            const { firstname, lastname, email, password } = jwt.decode(token);
            const user = new User({ firstname, lastname, email, password });
            user.save((err, user) => {
                if (err) {
                    return res.status(400).json({
                        error:
                            err.code == 11000 ? "This Account has already been activated." : "Something went wrong. Please sign up again."
                    });
                }
                // user.salt = undefined;
                // user.hashed_password = undefined;
                res.json({
                    email,
                    password
                });
            });
        });
    } else {
        return res.json({
            error: "Something went wrong. Try again."
        });
    }
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
        // if (req.params.role == "vendor" && user.role !== 1) {
        //     return res.status(401).json({
        //         error: "Sorry, you have no Vendor Permissions. Please register!"
        //     });
        // }
        // if user is found make sure the email and password match
        // create authenticate method in user model
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password dont match"
            });
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "3600" });
        res.cookie("token", token, { expiresIn: "3600" });

        const { _id, firstname, lastname, email, role } = user;
        return res.json({
            token,
            user: { _id, firstname, lastname, email, role },
            expiresIn: 3600
        });
    });
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.googleLogin = (req, res) => {
    const idToken = req.body.tokenId;
    client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID }).then(response => {
        // console.log(response);
        const { email_verified, given_name, family_name, email, jti } = response.payload;
        console.log(email_verified, given_name, family_name, email, jti);
        if (email_verified) {
            User.findOne({ email }).exec((err, user) => {
                if (user) {
                    // console.log(user)
                    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "3600" });
                    res.cookie("token", token, { expiresIn: "3600" });

                    const { _id, firstname, lastname, email, role } = user;
                    return res.json({
                        token,
                        user: { _id, firstname, lastname, email, role },
                        expiresIn: 3600
                    });
                } else {
                    let userId = shortId.generate();
                    // let profile = `${process.env.CLIENT_URL}/profile/${username}`;
                    const password = jti;
                    const firstname = given_name;
                    const lastname = family_name;
                    console.log({ userId, email, firstname, lastname, password });
                    const user = new User({ userId, firstname, lastname, email, password });
                    user.save((err, data) => {
                        if (err) {
                            return res.status(400).json({
                                error: JSON.stringify(err)
                            });
                        }
                        const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
                        res.cookie("token", token, { expiresIn: "3600" });
                        const { _id, firstname, lastname, email, role } = data;
                        return res.json({
                            token,
                            user: { _id, firstname, lastname, email, role },
                            expiresIn: 3600
                        });
                    });
                }
            });
        } else {
            return res.status(400).json({
                error: "Google login failed. Try again."
            });
        }
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

exports.forgotPassword = (req, res) => {
    const { email } = req.body;

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({
                error: "User with that email does not exist"
            });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, { expiresIn: "10m" });

        // email
        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Password reset link`,
            html: `
            <p>Please use the following link to reset your password:</p>
            <p>${process.env.CLIENT_URL}/auth/reset/${token}</p>
            <hr />
            <p>This email may contain sensetive information</p>
            <p>https://seoblog.com</p>
        `
        };
        // populating the db > user > resetPasswordLink
        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err) {
                return res.json({ error: errorHandler(err) });
            } else {
                sgMail.send(emailData).then(sent => {
                    return res.json({
                        message: `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10min.`
                    });
                });
            }
        });
    });
};

exports.resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    if (resetPasswordLink) {
        jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(err, decoded) {
            if (err) {
                return res.status(401).json({
                    error: "Expired link. Try again"
                });
            }
            User.findOne({ resetPasswordLink }, (err, user) => {
                if (err || !user) {
                    return res.status(401).json({
                        error: "Something went wrong. Try later"
                    });
                }
                const updatedFields = {
                    password: newPassword,
                    resetPasswordLink: ""
                };

                user = _.extend(user, updatedFields);

                user.save((err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        });
                    }
                    res.json({
                        message: `Great! Now you can login with your new password`
                    });
                });
            });
        });
    }
};
