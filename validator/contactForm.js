exports.contactFormValidator = (req, res, next) => {
    req.check("name", "Please enter a name!").notEmpty();
    req.check("email", "Email must be between 3 to 32 characters")
        .matches(/.+\@.+\..+/)
        .withMessage("Please enter a valid Email Address!")
        .isLength({
            min: 4,
            max: 32
        });
    req.check("message", "Please enter a Message!").notEmpty();
    req.check("message")
        .isLength({ min: 20 })
        .withMessage("Message must contain at least 20 characters!");
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};
