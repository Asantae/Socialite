const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const auth = require("../middleware/auth");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", ensureAuth, homeController.getIndex);
router.get("/profile");
router.get("/feed");
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout");
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router;
