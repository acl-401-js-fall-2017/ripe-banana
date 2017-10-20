const express = require('express');
const router = express.Router();
const Studio = require('../models/Studio');


router  
    .get('/', (req, res, next) => {
        Studio.find({})
            .then(mongoRes => {
                mongoRes;
            });
    });

module.exports = router;