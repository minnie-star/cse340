const invModel = require("../models/inventory-model");
const utilities = require("../utilities");
const jwt = require("jsonwebtoken");
require("dotenv").config();


/* **************************************
* Constructs the nav HTML unordered list
**************************************** */
async function getNav(req, res, next) {
    let data = await invModel.getClassifications()
    //console.log(data) when the function is called and the data is returned, it will be written to the server console and can be seen in the built in terminal. 
    let list = '<ul class="nav-list"> ';
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) => {
        list += "<li>"
        list += '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>";
        list += "</li>";
    });
    list += "</ul>";
    return list;
}



/* **********************************************
 * Build the classification view HTML
 * ********************************************** */
async function buildClassificationGrid(data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display" class="inv-grid">';
    data.forEach(vehicle => {
      grid += '<li>';
      grid += '<div class="namePrice">';
      //grid += '<hr />';
      grid += '<h2>';
      grid += '<a href="../../inv/detail/' + vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model 
        + ' details">' + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>';
      grid += '</h2>';
      grid += '<span>$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>';
      grid += '</div>';
      grid += '<a href="../../inv/detail/' + vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model 
        + ' details"><img src="' + vehicle.inv_thumbnail 
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model 
        + ' on CSE Motors" /></a>';
      
      grid += '</li>';
    });
    grid += '</ul>';
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **********************************************
 * Build classification list
 * ********************************************** */
async function buildClassificationList(selectedClassificationId = null) {
  const data = await invModel.getClassifications(); // query DB for classifications
  let options = "";

  data.rows.forEach((row) => {
    options += `<option value="${row.classification_id}"`;
    if (selectedClassificationId == row.classification_id) {
      options += " selected";
    }
    options += `>${row.classification_name}</option>`;
  });

  return options;
}

/* **********************************************
 * Build vehicle detail
 * ********************************************** */
function buildVehicleDetailHTML(vehicle) {
  const price = vehicle.inv_price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  });
  const mileage = vehicle.inv_miles.toLocaleString("en-US");

  return `<section class="vehicle-detail">
  <div class="vehicle-image">
  <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
  </div>
  <div class="vehicle-info">
  <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
  <p><strong>Price:</strong> $${price}</p>
  <p><strong>Mileage:</strong> ${mileage} miles</p>
  <p><strong>Description:</strong> ${vehicle.inv_description}</p>
  <p><strong>Color:</strong> ${vehicle.inv_color}</p>
  <p><strong>Classification:</strong> ${vehicle.classification_name}</p>
  </div>
  </section>`;
}

/* **********************************************
 * Error handeler
 * ********************************************** */
const handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


async function errorHandler(err, req, res, next) {
  console.error(err.stack);
  let nav = await utilities.getNav(); 
  res.status(err.status || 500);
  res.render("errors/error", {
    title: "Server Error",
    nav,
    message: "Something went wrong. Please try again later.",
    error: process.env.NODE_ENV == "development" ? err : {}
  });
}

/* **********************************************
 * Middleware to check token validity
 * ********************************************** */
function checkJWTToken(req, res, next) {
  if (req.cookies.jwt) {
      jwt.verify(
        req.cookies.jwt,
        process.env.ACCESS_TOKEN_SECRET,
        function (err, accountData) {
          if (err) {
            req.flash("notice", "Please log in")
            res.clearCookie("jwt")
            return res.redirect("/account/login")
          }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
        })
    } else {
      next()
    }
}

/* ****************************************
 *  Check Login
 * ************************************ */
function checkLogin (req, res, next) {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ***********************************************
 * Check account type
 * ********************************************** */
function checkAccountType(req, res, next) {
  if(!res.locals.accountData)
 {
    return res.redirect("/account/login")
    }
  if (res.locals.accountData.account_type == "Employee" ||
      res.locals.accountData.account_type == "Admin") 
    {
      next()
    } 
    else 
    {
      return res.redirect("/account/login")
    }
}

/* ***********************************************
 * Authorize JWT
 * ********************************************** */
function authorizeJWT (req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    res.locals.loggedin = false;
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.account = decoded;
    res.locals.loggedin = true;
    next();
  } catch (err) {
    res.locals.loggedin = false;
    next();
  }
};


module.exports = { 
  getNav, 
  buildClassificationGrid, 
  buildVehicleDetailHTML, 
  handleErrors, 
  errorHandler, 
  buildClassificationList,
  checkJWTToken,
  checkLogin,
  checkAccountType,
  authorizeJWT
};