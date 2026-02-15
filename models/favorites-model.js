// models/favorites-model.js
const pool = require("../database"); 

async function addFavorite(account_id, inv_id) {
  return pool.query(
    `INSERT INTO public.favorites (account_id, inv_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING
     RETURNING *`,
    [account_id, inv_id]
  );
}

async function getFavorites(account_id) {
  return pool.query(
    `SELECT f.favorite_id, f.inv_id,
            i.inv_make, i.inv_model, i.inv_year, i.inv_description
     FROM public.favorites f
     JOIN public.inventory i ON f.inv_id = i.inv_id
     WHERE f.account_id = $1
     ORDER BY f.created_at DESC`,
    [account_id]
  );
}

async function removeFavorite(account_id, inv_id) {
  return pool.query(
    `DELETE FROM public.favorites
     WHERE account_id = $1 AND inv_id = $2
     RETURNING *`,
    [account_id, inv_id]
  );
}


// const pool = require("../database");

// async function addFavorite(account_id, inv_id) {
//   const sql = `
//     INSERT INTO public.favorites (account_id, inv_id)
//     VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *`;
//   return pool.query(sql, [account_id, inv_id]);
// }

// async function removeFavorite(account_id, inv_id) {
//   const sql = `DELETE FROM favorites WHERE account_id = $1 AND inv_id = $2`;
//   return pool.query(sql, [account_id, inv_id]);
// }

// async function getFavorites(account_id) {
//   return pool.query(
//     `SELECT f.favorite_id, f.inv_id, i.inv_make, i.inv_model, i.inv_year, i.inv_description
//      FROM public.favorites f
//      JOIN public.inventory i ON f.inv_id = i.inv_id
//      WHERE f.account_id = $1
//      ORDER BY f.created_at DESC`,
//     [account_id]
//   );
// }

module.exports = { 
    addFavorite, 
    removeFavorite, 
    getFavorites 
};