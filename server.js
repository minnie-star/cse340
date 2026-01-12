// /* ******************************************

// * This server.js file is the primary file of the 

// * application. It is used to control the project.

// *******************************************/


// /* ***********************

// * Require Statements

// *************************/
// require("dotenv").config();

// const express = require("express"); /* this was missing*/

// const expressLayouts = require("express-ejs-layouts");




// const app = express();

// const staticRoutes = require("./routes/static");
// app.use(staticRoutes);


// /* ***********************

// * View Engine and Templates

// *************************/

// app.set("view engine", "ejs");

// app.use(expressLayouts);

// app.set("layout", "./layouts/layout");


// /* ***********************

// * Routes

// *************************/

// app.use(staticRoutes);


// app.get("/", function (req, res) {

// res.render("index", { title: "Home" }) /* this was missing */

// });


// /* ***********************

// * Local Server Information

// *************************/

// const port = process.env.PORT || 5500;

// const host = process.env.HOST || "localhost"; /****This was missing */


// /* ***********************

// * Log statement to confirm server operation

// *************************/

// app.listen(port, () => {

// console.log(`app listening on ${host}:${port}`)

// });

/* ******************************************
* Primary server file for the application
*******************************************/

/* Require Statements */
require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const staticRoutes = require("./routes/static");

/* Middleware */
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* View Engine and Templates */
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/layout");

/* Routes */
app.use(staticRoutes);

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

/* Local Server Information */
const port = process.env.PORT || 5500;
const host = process.env.HOST || "localhost";

/* Start Server */
app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`);
});