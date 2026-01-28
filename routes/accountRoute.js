//Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");

// Route for "My Acount" link
router.get("/", utilities.handleErrors(accountController.buildLogin));

router.get("/", utilities.handleErrors(accountController.buildRegister));

module.exports = router;