const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/post");
const User = require("../models/user");

module.exports = {
  getIndex: async (req, res) => {
    try {
      const post = await Post.find().sort({ createdAt: "desc" }).lean();
      const user = await User.findOne({ _id: req.session.user });
      let timingArr = [];
      for(let i = 0; i < post.length; i++){
        let now = new Date();
        let subtractedDate = now - post[i].createdAt;
        let seconds = subtractedDate / 1000;
        let minutes = seconds / 60;
        let hours = minutes / 60;
        let days = hours / 24;
        let weeks = days / 7;
        if (seconds < 59) {
          let timeAgo = Math.trunc(seconds) + "s";
          timingArr.splice(i, 0, timeAgo)
        } else if (minutes < 59) {
          let timeAgo = Math.trunc(minutes) + "m";
          timingArr.splice(i, 0, timeAgo)
        } else if (hours < 24) {
          let timeAgo = Math.trunc(hours) + "h";
          timingArr.splice(i, 0, timeAgo)
        } else if (days < 7) {
          let timeAgo = Math.trunc(days) + "d";
          timingArr.splice(i, 0, timeAgo)
        } else if (weeks < 2) {
          let timeAgo = Math.trunc(weeks) + " week(s) ago...";
          timingArr.splice(i, 0, timeAgo)
        } else {
          let timeAgo = post[i].createdAt;
          timingArr.splice(i, 0, timeAgo)
        }
      }
      res.render("index.ejs", { posts: post, username: user.username, timePosted: timingArr });
    } catch (err) {
      console.log(err);
      res.redirect("/login");
    }
  },
};
