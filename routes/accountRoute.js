// Needed Resources
const express = require("express");
const router = express.Router(); // no need for `new`
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/accountValidation");


// Default route for /account → redirect to login
router.get("/", (req, res) => {
  res.redirect("/account/login");
});

// Login routes
router.get("/login", utilities.handleErrors(accountController.buildLogin));
//router.post("/login", utilities.handleErrors(accountController.loginAccount));

// Register routes
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.post("/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

router.post("/login", (req, res) => {
  res.status(200).send("login process")
})

module.exports = router;