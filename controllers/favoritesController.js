const favoritesModel = require("../models/favorites-model");
const utilities = require("../utilities");

async function addFavorite(req, res) {
  const account_id = req.session.account_id;
  const inv_id = req.body.inv_id;

  console.log("Adding favorite:", { account_id, inv_id });

  if (!account_id) {
    return res.status(401).render("errors/error", {
      title: "Unauthorized",
      message: "You must be logged in to add favorites."
    });
  }

  if (!inv_id) {
    return res.status(400).render("errors/error", {
      title: "Bad Request",
      message: "No vehicle ID provided."
    });
  }

  try {
    const result = await favoritesModel.addFavorite(account_id, inv_id);
    if (result.rows.length === 0) {
      req.flash("notice", "This vehicle is already in your favorites.");
    } else {
      req.flash("notice", "Vehicle added to favorites!");
    }
    res.redirect("/account/favorites");
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).render("errors/error", {
      title: "Database Error",
      message: "Failed to add favorite."
    });
  }
}

async function getFavorites(req, res) {
  const account_id = req.session.account_id;
  let nav = await utilities.getNav();

  try {
    const result = await favoritesModel.getFavorites(account_id);
    const title = "My Favorites";
    const message = result.rows.length === 0 ? "You have not added any favorites yet." : null;

    res.render("account/favorites", {
      title,
      nav,
      message,
      favorites: result.rows
    });
  } catch (error) {
    res.status(500).render("errors/error", {
      title: "Database Error",
      message: "Failed to load favorites."
    });
  }
}

async function removeFavorite(req, res) {
  const account_id = req.session.account_id;
  const inv_id = req.body.inv_id;

  console.log("Removing favorite:", { account_id, inv_id });

  if (!account_id) {
    return res.status(401).render("errors/error", {
      title: "Unauthorized",
      message: "You must be logged in to remove favorites."
    });
  }

  try {
    await favoritesModel.removeFavorite(account_id, inv_id);
    req.flash("notice", "Favorite removed.");
    res.redirect("/account/favorites");
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).render("errors/error", {
      title: "Database Error",
      message: "Failed to remove favorite."
    });
  }
}

module.exports = { 
  addFavorite, 
  removeFavorite, 
  getFavorites };