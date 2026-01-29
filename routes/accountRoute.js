// Needed Resources
const express = require("express");
const router = express.Router(); // no need for `new`
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");

// Default route for /account → redirect to login
router.get("/", (req, res) => {
  res.redirect("/account/login");
});

// Login routes
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.post("/login", utilities.handleErrors(accountController.loginAccount)); // add login POST handler

// Register routes
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.post("/register", utilities.handleErrors(accountController.registerAccount));

module.exports = router;