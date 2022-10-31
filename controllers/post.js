const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");

exports.createPost = async (req, res) => {
    const title = req.body.title
    const caption = req.body.caption
    const id = req.session.user
    const user = await User.findById(req.session.user).lean();
try {
        await Post.create({
            title,
            caption: caption,
            id: id,
            username: user.username,
        })
        res.redirect("/home")
    } catch(error){
        return res.json({ status: 'error', error: error })
    }
}

exports.getPost = async (req, res) => {
    try{
        const postId = req.params.id
        const post = await Post.findOne({ _id: postId })
        const comments = await Comment.find({ post: postId })
        const user = await User.findOne({ _id: req.session.user });
        res.render("post.ejs", { post: post, comments: comments, username: user.username })
    } catch(err) {
        console.log(err)
        res.redirect("/home")
    }
}