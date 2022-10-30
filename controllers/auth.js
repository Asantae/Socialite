const User = require("../models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res) => {
  if (req.session.user) {
      return res.redirect("/");
  }
  res.render("login", {
      title: "Login",
  });
};

exports.postLogin = async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const user = await User.findOne({ username }).lean()
//in progress
  if(!user) {
      return res.json({ status:'error', error: 'Invalid username/password' })
  }
  if(user && (await bcrypt.compare(password, user.password))){
      let lastLoggedInAt = new Date().toLocaleString('en-US') + " " + "(timezone is in EST)"
      
      lastLoggedInAt.toString()
      const token = jwt.sign({
      id: user._id.toString(),
      username: user.username,
      lastLogged: lastLoggedInAt,
    }, process.env.SESSION_SECRET, {
      expiresIn: '2h'
    })
    req.session.user = user._id.toString()
    req.session.token = token
    res.redirect("/")
  } else {
  res.json ({ 
    status: 'error', 
    error: 'Invalid username/password',
    login: false, 
  })
  console.log('Invalid username or password')
  } 
}

exports.postSignup= async (req, res, next) => {
  const username = req.body.username
  const plainTextPassword = req.body.password
  const reEnteredPass = req.body.reEnteredPassword
  console.log(username)
  console.log(plainTextPassword)
  console.log(reEnteredPass)
  if(!username || typeof username !== 'string') {
    return res.json({status: 'error', error: 'Invalid Username'})
  }
  if(username.length < 6) {
    return res.json({status: 'error', error: 'Username must be 6 characters or longer'})
  }
  if (!plainTextPassword || typeof plainTextPassword !== 'string') {
    return res.json({ status: 'error', error: 'Invalid Password'})
  }
  if (plainTextPassword.length < 8) {
    return res.json({ status: 'error',  error: 'Password must be 8 characters or longer'})
  }
  if (plainTextPassword !== reEnteredPass) {
    return res.json({ status: 'error', error: 'The passwords do not match'})
  }
  
  const password = await bcrypt.hash(plainTextPassword, 15)
  try {
    const response = await User.create({
        username,
        password
    })
    const user = await User.findOne({ username }).lean()
    if(user){
        let lastLoggedInAt = new Date().toLocaleString('en-US') + " " + "(timezone is in EST)"
        
        lastLoggedInAt.toString()
        const token = jwt.sign({
        id: user._id.toString(),
        username: user.username,
        lastLogged: lastLoggedInAt,
      }, process.env.SESSION_SECRET, {
        expiresIn: '2h'
      })
      req.session.user = user._id.toString()
      req.session.token = token
      res.redirect("/")
    }
    
  } catch(error){
    if(error.code === 11000){
        return res.json({status: 'error', error: 'This username already exists'})
    }
    throw error
  }
}

//logout function
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error : Failed to destroy the session during logout.", err);
    }
    res.redirect("/");
  });
};

//if a user exists it will redirect to the dashboard
exports.getSignup = (req, res) => {
    if (req.session.user) {
      return res.redirect("/");
    }
    res.render("signup", {
      title: "Create Account",
    });
};
