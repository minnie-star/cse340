// favoritesRoute.js
const express = require("express");
const router = express.Router();
const favoritesController = require("../controllers/favoritesController");
const utilities = require("../utilities");
const favValidate = require("../utilities/favoriteValidation")

// Add to favorites
router.post("/add",
  utilities.checkLogin,
  favValidate.validateAddFavorite,
  utilities.handleErrors(favoritesController.addFavorite)
);

// Remove from favorites
router.post("/remove",
  utilities.checkLogin,
  favValidate.validateRemoveFavorite,
  utilities.handleErrors(favoritesController.removeFavorite)
);

// List all favorites
router.get("/",
  utilities.checkLogin,
  utilities.handleErrors(favoritesController.getFavorites)
);

module.exports = router;