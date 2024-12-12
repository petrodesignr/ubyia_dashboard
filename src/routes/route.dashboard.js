const express = require('express');
const sessionAuth = require('../middlewares/middleware.session');
const dashboardController = require('../controllers/controller.dashboard');
const router = express.Router();

router.get('/dashboard', sessionAuth, dashboardController.getDashboard);

router.post('/dashboard/priority/:id', sessionAuth, dashboardController.updatePriority);

router.post('/dashboard/status/:id', sessionAuth, dashboardController.updateStatus);

router.post('/dashboard/filter', sessionAuth, dashboardController.getFilteredTickets);


// router.get('/dashboard/priorityfilter/:id', sessionAuth, dashboardController.gettiketPriority);

// router.get('/dashboard/statusfilter/:id', sessionAuth, dashboardController.gettiketStatus);


module.exports = router;