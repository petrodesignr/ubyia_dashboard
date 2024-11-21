const express = require('express');
const sessionAuth = require('../middlewares/middleware.session');
const router = express.Router();

router.get('/dashboard', sessionAuth, (req, res) => {
    res.render('tickets/dashboard', { title: 'Home Dashboard'});
});

module.exports = router;