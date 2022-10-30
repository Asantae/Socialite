const User = require("../models/user");
const Post = require("../models/post");

exports.createPost = async (req, res) => {
    const title = req.body.title
    const caption = req.body.caption
    const id = req.session.user
    const user = await User.findById(req.session.user).lean();
try {
        const response = await Post.create({
            title,
            caption: caption,
            id: id,
            username: user.username,
        })
        res.redirect("/")
    } catch(error){
        return res.json({ status: 'error', error: error })
    }
}