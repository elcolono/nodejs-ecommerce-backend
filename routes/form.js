const express = require("express");
const router = express.Router();
const { contactForm, contactVendorForm } = require("../controllers/form");

const { contactFormValidator } = require("../validator/contactForm");

router.post("/contact", contactFormValidator, contactForm);
router.post("/contact-vendor", contactFormValidator, contactVendorForm);

module.exports = router;
