const favoritesModel = require("../models/favorites-model");

/* ****************************************
 *  Add a favorite
 * ************************************ */
async function addFavorite(req, res) {
  const account_id = req.session.account_id;
  const inv_id = req.body.inv_id;

  // Debug log to confirm values
  console.log("Attempting to add favorite:", { account_id, inv_id });

  // If no account_id in session, redirect to login
  if (!account_id) {
    return res.status(401).render("errors/error", {
      title: "Unauthorized",
      message: "You must be logged in to add favorites."
    });
  }

  try {
    const result = await favoritesModel.addFavorite(account_id, inv_id);

    if (result.rows.length === 0) {
      // ON CONFLICT DO NOTHING returns empty if duplicate
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

async function removeFavorite(req, res) {
  const account_id = req.session.account_id;
  const { inv_id } = req.body;
  try {
    await favoritesModel.removeFavorite(account_id, inv_id);
    res.redirect("/account/favorites");
  } catch (error) {
    res.status(500).render("errors/error", { 
      title: "Remove Favorites",
      message: "Failed to remove favorite." 
    });
  }
}

async function getFavorites(req, res) {
  const account_id = req.session.account_id;
  try {
    const result = await favoritesModel.getFavorites(account_id);
    res.render("account/favorites", { favorites: result.rows });
  } catch (error) {
    res.status(500).render("errors/error", { 
      title: "Database Error",
      message: "Failed to load favorites." 
    });
  }
}

module.exports = { 
  addFavorite, 
  removeFavorite, 
  getFavorites };