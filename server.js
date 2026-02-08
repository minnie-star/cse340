/* ******************************************
* Primary server file for the application
*******************************************/

/* ***********************
* Require Statements
*************************/
require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");

const pool = require("./database");
const utilities = require("./utilities");

// Routes
const staticRoutes = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const errorRoutes = require("./routes/error");
const accountRoute = require("./routes/accountRoute");

const app = express();

/* *************************
* Middleware
*************************** */
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Navigation middleware
app.use(async (req, res, next) => {
  try {
    res.locals.nav = await utilities.getNav();
    next();
  } catch (err) {
    next(err);
  }
});

// Session + flash
app.use(session({
  store: new pgSession({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: "sessionId",
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = require("express-message")(req, res);
  next();
});

// Cookies + JWT check
app.use(cookieParser());
app.use(utilities.checkJWTToken);

/* ***********************
* View Engine and Templates
*************************** */
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/layout");

/* ***********************
* Routes
*************************** */
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
    error: {},
  });
});

/* ***********************
* Express Error Handler
*************************** */
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  const message = err.status === 404
    ? err.message
    : "Oh no! There was a crash. Maybe try a different route?";
  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

/* ***********************
* Local Server Information
*************************** */
const port = process.env.PORT || 5500;
const host = process.env.HOST || "localhost";

/* ***********************
* Start Server
*************************** */
app.listen(port, () => {
  console.log(`App listening on http://${host}:${port}`);
});


