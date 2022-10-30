const jwt = require("jsonwebtoken")
const env = require('dotenv').config( {path: "./config/.env"} )

module.exports = {
  ensureAuth: async function (req, res, next) {
    
    if(req.session.user){
      try {
        //Verify the token using jwt.verify method (this ensures that the user hasnt manipulated the token)
        jwt.verify(req.session.token, process.env.SESSION_SECRET);
        return next();
      } catch(err){
        //If there is any error, the session will be destroyed and the user will be rerouted to the login page (will pretty much log out the user)
        req.session.destroy((error) => {
          if(error){
            console.log(error)
          }
        })
        console.log('error: ' + err.name);
        res.redirect("/login");
      }
    } else {
      //if no session exists the user will be rerouted to login page
      res.redirect("/login")
    }
  },
}