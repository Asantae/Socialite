const User = require("../models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Post = require("../models/post");
const Comment = require("../models/comment");

//allows users to comment on posts
exports.comment = async (req, res) => {
    const comment = req.body.comment;
    const post = req.params.id;
    const creator = req.session.user;
    const user = await User.findById(creator);
    const username = user.username;
    try {
        const response = await Comment.create({
            comment: comment,
            post: post,
            creatorId: creator,
            creatorUsername: username,

        })
        res.redirect("/post/" + post.toString())
    } catch (err) {
        console.log(err);
        res.redirect("/home")
    }
};