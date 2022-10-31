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
    
    try {
        const response = await Comment.create({
            comment: comment,
            post: post,
            creator: creator,

        })
        res.redirect("/post/" + post.toString())
    } catch (err) {
        console.log(err);
        res.redirect("/home")
    }
};