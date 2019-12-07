const express = require("express");
const router = express.Router();
const { contactForm, contactVendorForm } = require("../controllers/form");

// validators
const { runValidation } = require('../validator');
const { contactFormValidator } = require("../validator/form");

router.post("/contact", contactFormValidator, runValidation, contactForm);
router.post("/contact-vendor", contactFormValidator, runValidation, contactVendorForm);

module.exports = router;
