/* ******************************************

* This server.js file is the primary file of the 

* application. It is used to control the project.

*******************************************/

/* ***********************
* Require Statements
*************************/
const session = require("express-session");

const pool = require("./database");

require("dotenv").config();

const express = require("express");

const expressLayouts = require("express-ejs-layouts");

const app = express();

const staticRoutes = require("./routes/static");

const baseController = require("./controllers/baseController");

const inventoryRoute = require("./routes/inventoryRoute");

const utilities = require("./utilities");

const errorRoutes = require("./routes/error");

const accountRoute = require("./routes/accountRoute");

/* *************************
* Middleware
*************************** */
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(async (req, res, next) => {
  try {
    res.locals.nav = await utilities.getNav();
    next();
  } catch (err) {
    next(err);
  }
});

app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(require('connect-flash')());
app.use(function(req, res, next){
  res.locals.messages = require('express-message')(req, res)
  next()
})

/* ***********************

* View Engine and Templates

*************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/layout");
app.set("error", "views/errors/error");

/* ***********************

* Routes

*************************/
app.use(staticRoutes);

app.get("/", utilities.handleErrors(baseController.buildHome));

app.use("/inv", inventoryRoute);

app.use("/inventory", inventoryRoute);

app.use("/error", errorRoutes);

app.use("/account", accountRoute);

/* ***********************

 * 404 Handler

 *************************/
app.use(async (req, res, next) => {
  const nav = await utilities.getNav();
  res.status(404).render("errors/error", {
    title: "404 Page Not Found",
    message: "Sorry, the page you are looking for does not exist.",
    nav,
    error: {} // no stack trace for 404
  });
});


/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  try {
    const nav = await utilities.getNav();
    console.error(`Error at: "${req.originalUrl}": ${err.message}`);

    const message = err.status === 404 
      ? err.message 
      : "Oh no! There was a crash. Maybe try a different route?";

    res.status(err.status || 500).render("errors/error", {
      title: err.status || "Server Error",
      message,
      nav,
      error: process.env.NODE_ENV === "development" ? err : {}
    });
  } catch (error) {
    // fallback if nav fails
    res.status(500).send("Critical error rendering error page.");
  }
});

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