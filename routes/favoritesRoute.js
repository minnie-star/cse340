const express = require("express");
const router = new express.Router();
const favoritesController = require("../controllers/favoritesController");

// Middleware: ensure user is logged in
function checkLogin(req, res, next) {
  if (!req.session.account_id) {
    return res.redirect("/account/login");
  }
  next();
}

// Add to favorites
router.post("/add", checkLogin, favoritesController.addFavorite);

// Remove from favorites
router.post("/remove", checkLogin, favoritesController.removeFavorite);

// List all favorites
router.get("/", checkLogin, favoritesController.listFavorites);

module.exports = router;