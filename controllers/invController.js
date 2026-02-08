const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

/* ***********************************************
 * Build inventory by classification view
 * ********************************************** */
async function buildByClassificationId(req, res, next) {
  const classification_id = req.params.classificationId
      const data = await invModel.getInventoryByClassificationId(classification_id)
      let nav = await utilities.getNav()
  
      if (!data || data.length === 0) {
          res.render("./inventory/classification", {
              title: "NO VEHICLES HAVE BEEN FOUND",
              nav,
              grid: "There has not been any vehicles created in this classification."
          })
          return
      }
  
      const grid = await utilities.buildClassificationGrid(data)
      const className = data[0].classification_name
      res.render("./inventory/classification", {
          title: className + " vehicles",
          nav,
          grid,
      })
}

/* ***********************************************
 * Build inventory by inventory view
 * ********************************************** */
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
    vehicleHTML,
  });
}

/* ***********************************************
 * Return Inventory by Classification As JSON (AJAX)
 * ********************************************** */
async function getInventoryJSON(req, res, next) {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(classification_id);
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
}

/* ***********************************************
 * Build trigger error view
 * ********************************************** */
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
 * ********************************************** */
async function buildManagementView(req, res) {
  const nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    classificationSelect,
  });
}

/* ***********************************************
 * Build add classification view
 * ********************************************** */
async function buildAddClassification(req, res) {
  const nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    messages: req.flash("notice"),
    classification_name: "",
  });
}

/* ***********************************************
 * Add to classification view
 * ********************************************** */
async function addClassification(req, res) {
  let nav = await utilities.getNav()
    const { classification_name } = req.body
    const insertResult = await invModel.addClassification(classification_name)
  
    if (insertResult) {
      nav = await utilities.getNav()
      req.flash("message success", `The ${insertResult.classification_name} classification was successfully added.`)
      res.status(201).render("inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null,
      })
    } else {
      req.flash("message warning", "Sorry, the insert failed.")
      res.status(501).render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
      })
    }
}

/* ***********************************************
 * Build new inventory view
 * ********************************************** */
async function newInventoryView(req, res) {
  let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationSelect: classificationSelect,
      errors: null,
    })
}

/* ***********************************************
 * Add to inventory view
 * ********************************************** */
async function addInventory(req, res) {
  let nav = await utilities.getNav()
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
    const insertResult = await invModel.addInventory(
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    )
  
    if (insertResult) {
      const itemName = insertResult.inv_make + " " + insertResult.inv_model
      const classificationSelect = await utilities.buildClassificationList()
      req.flash("message success", `The ${itemName} was successfully added.`)
      res.status(201).render("./inventory/management", {
        title: "Inventory Management",
        nav,
        errors: null,
        classificationSelect,
      })
    } else {
      const classificationSelect = await utilities.buildClassificationList()
      req.flash("message warning", "Sorry, the insert failed.")
      res.status(501).render("./inventory/add-inventory", {
        title: "Add New Inventory",
        nav,
        classificationSelect: classificationSelect,
        errors: null,
      })
    }
}

/* ***********************************************
 * Edit inventory view
 * ********************************************** */
async function editInvItemView(req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const invData = await invModel.getInventoryById(inv_id)
    const classificationSelect = await utilities.buildClassificationList(invData.classification_id)
    const itemName = `${invData.inv_make} ${invData.inv_model}`
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id: invData.inv_id,
      inv_make: invData.inv_make,
      inv_model: invData.inv_model,
      inv_year: invData.inv_year,
      inv_description: invData.inv_description,
      inv_image: invData.inv_image,
      inv_thumbnail: invData.inv_thumbnail,
      inv_price: invData.inv_price,
      inv_miles: invData.inv_miles,
      inv_color: invData.inv_color,
      classification_id: invData.classification_id
    })
}

/* ***********************************************
 * Update inventory view
 * ********************************************** */
async function updateInventory(req, res, next) {
  let nav = await utilities.getNav()
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    } = req.body
  
    const updateResult = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    )
  
    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model
      req.flash("message success", itemName+' was successfully updated.')
      res.redirect("/inv/")
    } else {
      const classificationSelect = await utilities.buildClassificationList(
        classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("message warning", "Sorry, the insert failed.")
      res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
      })
    }
}

/* ***********************************************
 * Delete inventory view
 * ********************************************** */
async function deleteView(req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryById(inv_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_price: itemData.inv_price,
    })
}

/* ***********************************************
 * Delete inventory Item
 * ********************************************** */
async function deleteItem(req, res, next) {
  let nav = await utilities.getNav()
    const inv_id  = parseInt(req.body.inv_id)
   
    const deleteResult = await invModel.deleteInventoryItem(inv_id)
  
    if (deleteResult) {
      req.flash("message success", 'The deletion was successful.')
      res.redirect('/inv/')
    } else {
      req.flash("message warning", 'Sorry, the delete failed.')
      res.redirect("/inv/delete/inv_id")
    }
}

// async function buildClassificationList(selectedId = null) {
//   let data = await invModel.getClassifications();
//   let list = '<select id="classificationList" name="classification_id">';
//   list += '<option value="">Choose a classification</option>';
//   data.forEach(row => {
//     list += `<option value="${row.classification_id}"`;
//     if (selectedId == row.classification_id) {
//       list += " selected";
//     }
//     list += `>${row.classification_name}</option>`;
//   });
//   list += "</select>";
//   return list;
// }

module.exports = {
  buildByClassificationId,
  buildById,
  getInventoryJSON,   
  triggerError,
  buildAddClassification,
  addClassification,
  buildManagementView,
  newInventoryView,
  addInventory,
  editInvItemView,
  updateInventory,
  deleteView,
  deleteItem,
};