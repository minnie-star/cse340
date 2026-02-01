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

/* ***********************************************
* Build trigger error view
*  ********************************************** */
async function triggerError(req, res, next) {
    try {
        throw new Error("Intentional server error for testing purpose");
        
    } catch (err) {
        err.status = 500;
        next(err);
    }
}

/* ***********************************************
* Build management view
*  ********************************************** */
async function buildManagementView(req, res) {
  const nav = await utilities.getNav(); 
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    messages: req.flash("notice")
  });
}

/* ***********************************************
* Build add classification view
*  ********************************************** */
async function buildAddClassification(req, res) {
  const nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    messages: req.flash("notice"),
    classification_name: ""
  });
}

/* ***********************************************
* Add to classification view
*  ********************************************** */
async function addClassification(req, res) {
  const nav = await utilities.getNav();
  const { classification_name } = req.body;

  const result = await invModel.addClassification(classification_name);

  if (result) {
    req.flash("notice", "Classification added successfully.");
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, adding classification failed.");
    res.status(500).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      messages: req.flash("notice"),
      classification_name // sticky input
    });
  }
}

/* ***********************************************
* Build add inventory view
*  ********************************************** */
async function buildAddInventory(req, res) {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    messages: req.flash("notice"),
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "",
    inv_thumbnail: "",
    inv_price: "",
    inv_miles: "",
    classification_id: ""

  });
}

/* ***********************************************
* Add to inventory view
*  ********************************************** */
async function addInventory(req, res) {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();

  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, classification_id } = req.body;

  const result = await invModel.addInventory(
    inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, classification_id
  );

  if (result) {
    req.flash("notice", "Vehicle added successfully.");
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, adding vehicle failed.");
    res.status(500).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      messages: req.flash("notice"),
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      classification_id,
      ...req.body
    });
  }
}

module.exports = { 
    buildByClassificationId, 
    buildById, 
    triggerError, 
    buildAddClassification, 
    addClassification, 
    buildManagementView, 
    buildAddInventory,
    addInventory
};

