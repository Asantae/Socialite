const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res) => {
  if (req.session.user) {
      return res.redirect("/home");
  }
  res.render("login", {
      title: "Login",
  });
};

exports.postLogin = async (req, res) => {
  const username = req.body.username
  const password = req.body.password
  const user = await User.findOne({ username }).lean()

  if(!user || typeof username !== 'string') {
    return res.json({status: 'error', error: 'Invalid Username'})
  }

  if(user && (await bcrypt.compare(password, user.password))){
    let lastLoggedInAt = new Date().toLocaleString('en-US') + " " + "(timezone is in EST)"
    lastLoggedInAt.toString()
    const token = jwt.sign({
      id: user._id.toString(),
      username: user.username,
      lastLogged: lastLoggedInAt,
    }, process.env.SESSION_SECRET, {
    expiresIn: '3h'
    })
    req.session.user = user._id
    req.session.token = token
    return res.json({ status: "ok" })
  } else {
    return res.json({ status:'error', error: 'Invalid username/password' })
  } 
}

exports.postSignup= async (req, res, next) => {
  const username = req.body.username
  const plainTextPassword = req.body.password
  const reEnteredPass = req.body.reEnteredPass

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
      return res.json({ status: "ok" })
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
    res.redirect("/home");
  });
};

//if a user exists it will redirect to the dashboard
exports.getSignup = (req, res) => {
  if (req.session.user) {
    return res.redirect("/home");
  }
  res.render("signup", {
    title: "Create Account",
  });
};

//this will render the profile page depending on the passed in parameters
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.session.user });
    const users = await User.findOne({ username: req.url.split("/")[2] });
    const post = await Post.find({ username: users.username }).sort({ createdAt: "desc" }).lean();
    let comments =[]
    for(let i = 0; i < post.length; i++){
      let comment = await Comment.find({ post: post[i]._id })
      if(comment === null){
        comments.splice(i, 0 , 0)
      } else {
        comments.splice(i, 0 , comment.length)
      }
    }
    let timingArr = [];
    for(let i = 0; i < post.length; i++){
      let now = new Date();
      let subtractedDate = now - post[i].createdAt;
      let seconds = subtractedDate / 1000;
      let minutes = seconds / 60;
      let hours = minutes / 60;
      if (seconds < 59) {
        let timeAgo = Math.trunc(seconds) + "s";
        timingArr.splice(i, 0, timeAgo)
      } else if (minutes < 59) {
        let timeAgo = Math.trunc(minutes) + "m";
        timingArr.splice(i, 0, timeAgo)
      } else if (hours < 24) {
        let timeAgo = Math.trunc(hours) + "h";
        timingArr.splice(i, 0, timeAgo)
      } else {
        let timeAgo = post[i].createdAt;
        timingArr.splice(i, 0, timeAgo)
      }
    }

    res.render("profile.ejs", { username: user.username, profileUsername: users.username, posts: post, timePosted: timingArr, comments: comments, user: user });
  } catch(err) {
    console.log(err)
    res.redirect("/home")
  };

};
