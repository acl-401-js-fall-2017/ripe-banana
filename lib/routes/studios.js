const express = require('express');
const router = express.Router();
const Studio = require('../models/Studio');


router  
    .post('/', (req, res, next) => {
        new Studio(req.body)
            .save()
            .then(mongoRes => {
                res.send(mongoRes);
            })
            .catch(next);
    })
    .get('/', (req, res, next) => {
        Studio.find({})
            .then(mongoRes => {
                mongoRes;
            })
            .catch(next);
    });

module.exports = router;