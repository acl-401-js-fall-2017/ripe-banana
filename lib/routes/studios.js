const express = require('express');
const router = express.Router();

const Studio = require('../models/studio');

router

    .get('/', (req, res, next) => {
        Studio.find()
            .then(studio => res.json)

    })





module.exports = router;