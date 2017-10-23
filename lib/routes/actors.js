const express = require('express');
const router = express.Router();

const Actor = require('../models/actor');

router

    .post('/', (req, res, next) => {
        new Actor(req.body).save()
            .then(actor => res.json(actor))
            .catch(next);

    })

    .get('/', (req, res, next) => {
        Actor.find()
            .select('name _id')
            .lean()
            .then(actor => res.json(actor))
            .catch(next);

    });





module.exports = router;