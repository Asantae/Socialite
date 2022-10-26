const User = require("../models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res) => {
  if (req.user) {
      return res.redirect("/dashboard");
  }
  res.render("login", {
      title: "Login",
  });
};

exports.postLogin = async (req, res, next) => {
    const username = req.body.name[0]
    const password = req.body.name[1]
    const user = await User.findOne({ username }).lean()
//in progress
    req.session.regenerate(function (err) {
        if (err) next(err)
    
        // store user information in session, typically a user id
        req.session.user = req.body.user
    
        // save the session before redirection to ensure page
        // load does not happen before session is saved
        req.session.save(function (err) {
          if (err) return next(err)
          res.redirect('/')
// in progress
    if(!user) {
        return res.json({ status:'error', error: 'Invalid username/password' })
    }
    if(user && (await bcrypt.compare(password, user.password))){
            let lastLoggedInAt = new Date().toLocaleString('en-US') + " " + "(timezone is in EST)"
            console.log(lastLoggedInAt)
            lastLoggedInAt.toString()
            const token = jwt.sign({
            id: user._id,
            username: user.username,
            lastLogged: lastLoggedInAt,
        }, process.env.SESSION_SECRET, {
            expiresIn: '2h'
        })
        // update certain fields in db
        await User.findOne(
        {
            username: username,
        },
        )
        res.json({
            user: username, 
            status: 'ok',
            token: token,
            login: true,
        })
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
  const username = req.body.name[0]
  const plainTextPassword = req.body.name[1]
  const reEnteredPass = req.body.name[2]
  
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
    return res.json({ status: 'ok', response })
      
  } catch(error){
    if(error.code === 11000){
        return res.json({status: 'error', error: 'This username already exists'})
    }
    throw error
  }
}

//logout function
exports.logout = (req, res) => {
  req.logout(() => {
    console.log('User has logged out.')
  })
  req.session.destroy((err) => {
    if (err)
      console.log("Error : Failed to destroy the session during logout.", err);
    req.user = null;
    res.redirect("/");
  });
};

//if a user exists it will redirect to the dashboard
exports.getSignup = (req, res) => {
    if (req.user) {
      return res.redirect("/dashboard");
    }
    res.render("signup", {
      title: "Create Account",
    });
};
