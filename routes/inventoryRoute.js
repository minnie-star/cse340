//Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const { 
  classificationValidationRules, 
  checkClassificationData, 
  inventoryValidationRules, 
  checkInventoryData 
} = require("../utilities/inventory-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Add routes for the classification form
router.get("/add-classification", invController.buildAddClassification);
router.post(
  "/add-classification",
  classificationValidationRules(),   
  checkClassificationData,           
  invController.addClassification   
);

// Route for vehicle details view
router.get("/detail/:invId", invController.buildById);

router.get("/error/:trigger-error", invController.triggerError);

// Management view route
router.get("/", invController.buildManagementView);

// inventoryRoute.js
router.get("/add-inventory", invController.buildAddInventory);
router.post(
  "/add-inventory",
  inventoryValidationRules(),   
  checkInventoryData,           
  invController.addInventory  
);

module.exports = router;