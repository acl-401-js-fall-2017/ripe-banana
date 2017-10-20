const express = require('express');
const router = express.Router();

const Studio = require('../models/studio');

router

    .post('/', (req, res, next) => {
        new Studio(req.body).save()
            .then( studio => res.json(studio))
            .catch(next);

    })

    .get('/', (req, res, next) => {
        Studio.find()
            .select('name _id')
            .lean()
            .then(studio => res.json(studio))
            .catch(next);

    });





module.exports = router;