const invModel = require("../models/inventory-model");
//const Util = {};

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

function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500);
  res.render("errors/error", {
    title: "Server Error", nav,
    message: "Something went wrong. Please try again later.",
    error: process.env.NODE_ENV == "development" ? err : {}
  });
}

module.exports = { getNav, buildClassificationGrid, buildVehicleDetailHTML, handleErrors, errorHandler};