const { body } = require("express-validator");

/**
 * Validation rules for adding a favorite
 */
const validateAddFavorite = [
  body("inv_id")
    .isInt({ min: 1 })
    .withMessage("Invalid vehicle ID.")
];

/**
 * Validation rules for removing a favorite
 */
const validateRemoveFavorite = [
  body("inv_id")
    .isInt({ min: 1 })
    .withMessage("Invalid vehicle ID.")
];

module.exports = { 
  validateAddFavorite, 
  validateRemoveFavorite 
};