const router = require('express').Router();
// const User = require('../models/user');
// const tokenService = require('../utils/token-service');
const ensureAuth = require('../utils/ensure-auth')();

module.exports = router
    .get('/verify', ensureAuth, (req, res) => {
        res.json({ verified: true });
    });