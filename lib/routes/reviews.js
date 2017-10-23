const express = require('express');
const router = express.Router();

const Review = require('../models/review');

router
    .post('/', (req, res, next) =>{
        new Review(req.body).save()
            .then(review => res.json(review))
            .catch(next);
    });

module.exports = router;