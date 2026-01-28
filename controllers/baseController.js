const utilities = require("../utilities/");
//const baseController = {};

async function buildHome(req, res) {
    const nav = await utilities.getNav();
    //req.flash("notice", "This is a flash message.")
    res.render("index", {title: "Home", nav});
};

module.exports = {buildHome};