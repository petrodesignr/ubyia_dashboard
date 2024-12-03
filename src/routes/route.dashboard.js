const express = require('express');
const sessionAuth = require('../middlewares/middleware.session');
const dashboardController = require('../controllers/controller.dashboard');
const router = express.Router();

router.get('/dashboard', sessionAuth, dashboardController.getDashboard);

router.post('/dashboard/priority/:id', sessionAuth, dashboardController.updatePriority);

router.post('/dashboard/status/:id', sessionAuth, dashboardController.updateStatus);


module.exports = router;