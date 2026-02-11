const baseController = require("../controllers/baseController");

app.get("/", baseController.buildHome);