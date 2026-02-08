// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invChecks = require("../utilities/inventory-validation");

router.get("/type/:classificationId", invController.buildByClassificationId);


/* ****************************************
 * Route to build vehicle detail view
 **************************************** */
router.get("/detail/:id", 
utilities.handleErrors(invController.buildById))

/* ****************************************
 * Error Route
 **************************************** */
router.get(
  "/broken",
  utilities.handleErrors(invController.triggerError)
)

/* ****************************************
 * Build Management View Route
 **************************************** */
router.get(
  "/",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagementView)
)

/* ****************************************
 * Build add-classification View Route
 **************************************** */
router.get(
  "/newClassification",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
)


/* ****************************************
 * Process add-classification Route
 **************************************** */
router.post(
  "/addClassification",
  utilities.checkAccountType,
  invChecks.classificationValidationRules(),
  invChecks.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

/* ****************************************
 * Build add-vehicle View Route
 **************************************** */
router.get(
  "/newVehicle",
  utilities.checkAccountType,
  utilities.handleErrors(invController.newInventoryView)
)

/* ****************************************
 * Process add-vehicle Route
 **************************************** */
router.post(
  "/addInventory",
  utilities.checkAccountType,
  invChecks.inventoryValidationRules(),
  invChecks.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

/* ****************************************
 * Get vehicles for AJAX Route
 **************************************** */
router.get(
  "/getInventory/:classification_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON)
)

/* ****************************************
 * Deliver the edit inventory view
 **************************************** */
router.get(
  "/edit/:inv_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.editInvItemView)
)

/* ****************************************
 * Process the edit inventory request
 **************************************** */
router.post(
  "/update",
  utilities.checkAccountType,
  invChecks.inventoryValidationRules(),
  invChecks.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

/* ****************************************
 * Deliver the delete confirmation view
 **************************************** */
router.get(
  "/delete/:inv_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteView)
)

/* ****************************************
 * Process the delete inventory request
 **************************************** */
router.post("/delete", 
utilities.checkAccountType, 
utilities.handleErrors(invController.deleteItem)
)


module.exports = router;