const express = require('express');
const sessionAuth = require('../middlewares/middleware.session');
const dashboardController = require('../controllers/controller.dashboard');
const router = express.Router();

router.get('/dashboard', sessionAuth, dashboardController.getDashboard);

module.exports = router;