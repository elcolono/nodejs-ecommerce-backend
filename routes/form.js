const express = require("express");
const router = express.Router();
const { contactForm } = require("../controllers/form");

const { runValidation } = require("../validator");
const { contactFormValidator } = require("../validator/contactForm");

router.post("/contact", contactFormValidator, contactForm);

module.exports = router;
