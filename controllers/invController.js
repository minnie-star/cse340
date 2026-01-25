const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

//const invCont = {}

/* ***********************************************
* Build inventory by classification view
*  ********************************************** */
async function buildByClassificationId (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("inventory/classification", {
        title: className + " Vehicles", nav, grid,
    })
}

/* ***********************************************
* Build inventory by inventory view
*  ********************************************** */
async function buildById(req, res, next) {
    const invId = req.params.invId;
    const vehicleData = await invModel.getVehicleById(invId);

    if (!vehicleData) {
        return res.status(404).send("vehicle not found");
    }

    const vehicleHTML = utilities.buildVehicleDetailHTML(vehicleData);
    const nav = await utilities.getNav();

    res.render("inventory/detail", {
        title: `${vehicleData.inv_make} ${vehicleData.inv_model}`, 
        nav,
        vehicleHTML
    });
}

async function triggerError(req, res, next) {
    try {
        throw new Error("Intentional server error for testing purpose");
        
    } catch (err) {
        err.status = 500;
        next(err);
    }
}
module.exports = { buildByClassificationId, buildById, triggerError};