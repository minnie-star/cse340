const utilities = require("../utilities/");
const { body, validationResult } = require("express-validator");

const classificationValidationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isAlphanumeric().withMessage("Classification must contain only letters and numbers.")
      .notEmpty().withMessage("Classification name is required.")
  ];
};

const checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    return res.status(400).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      messages: errors.array().map(err => err.msg),
      classification_name: req.body.classification_name
    });
  }
  next();
};

const inventoryValidationRules = () => {
  return [
    body("inv_make").trim().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().notEmpty().withMessage("Model is required."),
    body("inv_year").isInt({ min: 1900, max: 2099 }).withMessage("Year must be valid."),
    body("inv_description").trim().notEmpty().withMessage("Description is required."),
    body("inv_image").trim().notEmpty().withMessage("Image path is required."),
    body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required."),
    body("inv_price").isFloat({ min: 0 }).withMessage("Price must be positive."),
    body("inv_miles").isInt({ min: 0 }).withMessage("Miles must be positive."),
    body("classification_id").isInt().withMessage("Classification is required.")
  ];
};

const checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(req.body.classification_id);
    return res.status(400).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      messages: errors.array().map(err => err.msg),
      ...req.body // sticky inputs
    });
  }
  next();
}

module.exports = { classificationValidationRules, checkClassificationData, inventoryValidationRules, checkInventoryData };