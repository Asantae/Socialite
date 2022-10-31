const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments");
const { ensureAuth } = require("../middleware/auth");

//Comment Routes - simplified for now
router.post("/comment/:id", ensureAuth, commentsController.comment);

module.exports = router;