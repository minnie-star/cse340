// Needed Resources
const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const accountController = {}

// Login view
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  const notice = req.flash("notice");
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    notice,
  });
}

// Register view
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

accountController.registerView = async (req, res) => {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Registration",
    nav,
    errors: null
  })
}

// Handle registration form submission
async function registerAccount(req, res, next) {
  let nav = await utilities.getNav();
  const { account_name, account_lastname, account_email, account_password } = req.body;

  const regResult = await accountModel.registerAccount(
    account_name,
    account_lastname,
    account_email,
    account_password
  );

  if (regResult && regResult.rows && regResult.rows.length > 0) {
    req.flash("notice", `Congratulations, you're registered ${account_name}. Please log in.`);
    res.status(201).render("account/login", { title: "Login", nav, errors: null });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", { title: "Register", nav, errors: null });
  }
}


// Handle login form submission
async function loginAccount(req, res, next) {
  try {
    const { account_email, account_password } = req.body;

    // TODO: Add validation and DB check here
    // For now, just confirm receipt
    res.send(`Login attempt with email: ${account_email}`);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  loginAccount,
};