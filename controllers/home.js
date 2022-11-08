const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");

module.exports = {
  getIndex: async (req, res) => {
    try {
      const post = await Post.find().sort({ createdAt: "desc" }).lean();
      const user = await User.findOne({ _id: req.session.user });
      let comments =[]
      for(let i = 0; i < post.length; i++){
        console.log(post[i]._id)
        let comment = await Comment.find({ post: post[i]._id })
        if(comment === null){
          comments.splice(i, 0 , 0)
        } else {
          comments.splice(i, 0 , comment.length)
        }
      }
      console.log(comments)
      console.log(comments.length)
      
      let timingArr = [];
      for(let i = 0; i < post.length; i++){
        let now = new Date();
        let subtractedDate = now - post[i].createdAt;
        let seconds = subtractedDate / 1000;
        let minutes = seconds / 60;
        let hours = minutes / 60;
        let days = hours / 24;
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
      res.render("index.ejs", { posts: post, username: user.username, timePosted: timingArr, comments: comments });
    } catch (err) {
      console.log(err);
      res.redirect("/login");
    }
  },
};
