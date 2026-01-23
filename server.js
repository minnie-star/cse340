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

const inventoryRoute = require("./routes/inventoryRoute");

const utilities = require("./utilities/index");

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

app.get("/", utilities.handleErrors(baseController.buildHome));

app.use("/inv", inventoryRoute);

app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************

* Express Error Handler
* Place after all other middleware

*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalURL}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error', message, nav
  })
})


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