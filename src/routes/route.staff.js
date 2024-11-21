const express = require("express");
const router = express.Router();
const sessionAuth = require("../middlewares/middleware.session");
const staffController = require("../controllers/controller.staff");
const isConnect = require("../middlewares/middleware.isConnect");

// Route login page
router.get("/login", isConnect, staffController.login);
router.post("/login", isConnect, staffController.login);

// Route account page
router.get("/accountCreation", isConnect, staffController.accountCreation);
router.post("/accountCreation", isConnect, staffController.accountCreation);

// Route account update page
router.get("/account", staffController.account);
router.post("/account", staffController.account);

// Route home page
router.get("/404Error", sessionAuth, staffController.home);
// Route logout page
router.get("/logout", staffController.logout);

// router.get('/forgetMDP', staffController.forgetMDP);
// router.post('/forgetMDP', staffController.forgetMDP);

module.exports = router;
