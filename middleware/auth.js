const jwt = require("jsonwebtoken")
const env = require('dotenv').config( {path: "./config/.env"} )
const User = require("../models/user");

module.exports = {
  ensureAuth: async function (req, res, next) {
    console.log(req.session)
    // Verify the token using jwt.verify method
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return next();
    } catch(err){
      console.log('error: ' + err.name);
      res.redirect("/login");
    }
  },
}