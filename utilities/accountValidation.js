const utilities = require(".");
const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");

/* ***********************************************
 * Registration rules
 * ********************************************** */
function registrationRules() {
  return [
    body("account_firstname")
      .trim().notEmpty().isLength({ min: 1 })
      .withMessage("Please provide a first name."),
    body("account_lastname")
      .trim().notEmpty().isLength({ min: 2 })
      .withMessage("Please provide a last name."),
    body("account_email").trim().isEmail().normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
    const emailExists = await accountModel.checkExistingEmail(account_email)
      if (emailExists) {
        throw new Error("Email exists. Please log in or use a different email")
      }
    }),
    body("account_password")
      .trim().notEmpty().isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ***********************************************
 * Error handling check registration data
 * ********************************************** */
async function checkRegData(req, res, next) {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/* ***********************************************
 * Rules for login form
 * ********************************************** */
function loginRules() {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email address."),
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required.")
  ]
}

/* ***********************************************
 * Middleware to check login data
 * ********************************************** */
 async function checkLoginData(req, res, next) {
  const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/login", {
        errors,
        title: "Login",
        nav,
        account_email,
      })
      return
    }
    next()
}

/* ***********************************************
 * Require login
 * ********************************************** */
function requireLogin(req, res, next) {
if (!req.session || !req.session.account) {
req.flash("notice", "Please log in")
return res.redirect("/account/login")
}
next()
}

/* ***********************************************
 * Update rules
 * ********************************************** */
function updateRules() {
  return [
    // name is required and must be string
    body("account_firstname")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // name is required and must be string
    body("account_lastname")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required
    // if email is being changed, it cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const account_id = req.body.account_id
        const account = await accountModel.getAccountById(account_id)
        // Check if submitted email is same as existing
        if (account_email != account.account_email) {
          // No  - Check if email exists in table
          const emailExists = await accountModel.checkExistingEmail(
            account_email
          )
          // Yes - throw error
          if (emailExists.count != 0) {
            throw new Error("Email exists. Please use a different email")
          }
        }
      }),
  ]
}

/* ***********************************************
 * Check edit data
 * ********************************************** */
async function checkEditData(req, res, next) {
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/update", {
      errors,
      title: "Edit Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    })
    return
  }
  next()
}

/* ***********************************************
 * Password rules
 * ********************************************** */
function passwordRule() {
  return [
    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ***********************************************
 * Check password
 * ********************************************** */
async function checkPassword(req, res, next) {
  const account_password = req.body.account_password
  const account_id = parseInt(req.body.account_id)
  const accountData = await accountModel.getAccountById(account_id)
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/update", {
      errors,
      title: "Edit Account",
      nav,
      account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    })
    return
  }
  next()
}

module.exports = {
  registrationRules,
  checkRegData,
  loginRules,
  checkLoginData,
  requireLogin,
  updateRules,
  checkEditData,
  passwordRule,
  checkPassword
}