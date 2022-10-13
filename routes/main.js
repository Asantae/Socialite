const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/profile");
router.get("/feed");
router.get("/login");
router.post("/login");
router.get("/logout");
router.get("/signup");
router.post("/signup");

module.exports = router;
