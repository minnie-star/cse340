const favoritesModel = require("../models/favorites-model");

async function addFavorite(req, res) {
  const account_id = req.session.account_id;
  const { inv_id } = req.body;
  try {
    await favoritesModel.addFavorite(account_id, inv_id);
    res.redirect(`/inventory/detail/${inv_id}`);
  } catch (error) {
    res.status(500).render("errors/error", { message: "Failed to add favorite." });
  }
}

async function removeFavorite(req, res) {
  const account_id = req.session.account_id;
  const { inv_id } = req.body;
  try {
    await favoritesModel.removeFavorite(account_id, inv_id);
    res.redirect("/account/favorites");
  } catch (error) {
    res.status(500).render("errors/error", { message: "Failed to remove favorite." });
  }
}

async function listFavorites(req, res) {
  const account_id = req.session.account_id;
  try {
    const result = await favoritesModel.getFavorites(account_id);
    res.render("account/favorites", { favorites: result.rows });
  } catch (error) {
    res.status(500).render("errors/error", { message: "Failed to load favorites." });
  }
}

module.exports = { 
    addFavorite, 
    removeFavorite, 
    listFavorites };