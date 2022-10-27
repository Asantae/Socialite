const jwt = require("jsonwebtoken")
const env = require('dotenv').config( {path: "./config/.env"} )
const User = require("../models/user");

module.exports = {
  ensureAuth: async function (req, res, next) {
    if(req.session.user){
      try {
        //Verify the token using jwt.verify method
        jwt.verify(req.session.token, process.env.JWT_SECRET);
        return next();
      } catch(err){
        console.log('error: ' + err.name);
        res.redirect("/login");
      }
    } else {
      res.redirect("/login")
    }
    
    
  },
}