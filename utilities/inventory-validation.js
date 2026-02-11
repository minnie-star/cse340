const utilities = require("../utilities/");
const { body, validationResult } = require("express-validator");

/* ***********************************************
 * Classification validation rules
 * ********************************************** */
const classificationValidationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isAlphanumeric().withMessage("Classification must contain only letters and numbers.")
      .notEmpty().withMessage("Classification name is required.")
  ];
};

/* ***********************************************
 * Check classification data
 * ********************************************** */
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

/* ***********************************************
 * Inventory validation rukes
 * ********************************************** */
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

/* ***********************************************
 * Check inventory data
 * ********************************************** */
const checkInventoryData = async (req, res, next) => {
  const {
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      const classificationSelect = await utilities.buildClassificationList(
        classification_id
      )
      res.render("inventory/add-inventory", {
        errors,
        title: "Add Vehicle",
        nav,
        classificationSelect,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
      })
      return
    }
    next()
}

/* ***********************************************
 * Check update data
 * ********************************************** */
async function checkUpdateData(req, res, next ) {
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    inv_id,
  } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    )
    res.render("inventory/edit-inventory", {
      errors,
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      classificationSelect,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      inv_id,
    })
    return
  }
  next()
}

module.exports = { 
  classificationValidationRules, 
  checkClassificationData, 
  inventoryValidationRules, 
  checkInventoryData,
  checkUpdateData 
};