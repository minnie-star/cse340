// Needed Resources
const express = require("express");
const router = express.Router(); 
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/accountValidation");

/* ************************************
 *  Deliver Login View
 *  ******************************** */
router.get("/login", utilities.handleErrors(accountController.buildLogin))

/* ************************************
 *  Deliver Registration View
 *  ******************************** */
router.get("/register", utilities.handleErrors(accountController.buildRegister))

/* ************************************
 *  Process Registration
 *  ******************************** */
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

/* ************************************
 *  Process Login
 *  ******************************** */
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.loginAccount)
)

/* ************************************
 *  Deliver Account Management View
 *  ******************************** */
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement)
)


/* ****************************************
 * Build update
 **************************************** */
router.get(
  "/update/:id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdate)
)

/* ****************************************
 * Process update
 **************************************** */
router.post(
  "/update",
  utilities.checkLogin,
  regValidate.updateRules(),
  regValidate.checkEditData,
  utilities.handleErrors(accountController.processUpdate)
)

/* ****************************************
* Process password
 **************************************** */
router.post(
  "/password",
  utilities.checkLogin,
  regValidate.passwordRule(),
  regValidate.checkPassword,
  utilities.handleErrors(accountController.processPassword)
)

/* ****************************************
* Account logout
 **************************************** */
router.get(
  "/logout",
  utilities.handleErrors(accountController.accountLogout)
)
module.exports = router; 