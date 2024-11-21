const express           = require('express');
const router            = express.Router();
const sessionAuth = require("../middlewares/middleware.session");
const userController = require("../controllers/controller.user");

//se connecter au formulaire staff
router.get ('/login', userController.login);
router.post('/login', userController.login);

//deconnexion du compte staff
router.get('/logout', sessionAuth, userController.logout);

// creation ou connexion de compte user
router.post('/signIn', userController.signIn);
router.post('/signUp', userController.signUp);

module.exports = router;
