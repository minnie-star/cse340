/* ******************************************

* This server.js file is the primary file of the 

* application. It is used to control the project.

*******************************************/
/* ***********************

* Require Statements
*************************/
require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const staticRoutes = require("./routes/static");

const baseController = require("./controllers/baseController");

/* Middleware */
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ***********************

* View Engine and Templates

*************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/layout");

/* ***********************

* Routes

*************************/
app.use(staticRoutes);

app.get("/", baseController.buildHome);

/* ***********************

* Local Server Information

*************************/
const port = process.env.PORT || 5500;
const host = process.env.HOST || "localhost";

/* ***********************

* Log statement to confirm server operation

*************************/
app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`);
});