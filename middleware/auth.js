const jwt = require("jsonwebtoken")
const env = require('dotenv').config( {path: "./config/.env"} )
const User = require("../models/user");

module.exports = {
  ensureAuth: async function (req, res, next) {
    
    if(req.session.user){
      try {
        console.log(req.session.user)
        //Verify the token using jwt.verify method
        jwt.verify(req.session.token, process.env.SESSION_SECRET);
        return next();
      } catch(err){
        req.session.destroy((error) => {
          if(error){
            console.log(error)
          }
        })
        console.log('error: ' + err.name);
        res.redirect("/login");
      }
    } else {
      res.redirect("/login")
    }
  },
}