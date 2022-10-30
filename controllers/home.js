const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/post");
const User = require("../models/user");

module.exports = {
  getIndex: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("index.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
      res.redirect("/login")
    }
  },
};
