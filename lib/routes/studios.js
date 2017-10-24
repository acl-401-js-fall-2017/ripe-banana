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

    })

    .get('/:id', (req, res, next) => {
        Studio.findById(req.params.id)
            .select('name address films')
            .populate({
                path:'films',
                select:'title'
            })
            .lean()
            .then(response =>{
                let studio = response.body;
                res.send(studio);
            });
    });
module.exports = router;