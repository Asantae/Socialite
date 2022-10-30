const express = require("express");
const router = express.Router();
const postsController = require("../controllers/post");
const { ensureAuth } = require("../middleware/auth");

//Post Routes - simplified for now
//router.get("/:id", ensureAuth, postsController.getPost);

router.post("/createPost", ensureAuth, postsController.createPost);

//router.put("/likePost/:id", postsController.likePost);

//router.delete("/deletePost/:id", postsController.deletePost);

module.exports = router;
