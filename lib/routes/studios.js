const router = require('express').Router();
const Studio = require('../models/studio');

module.exports = router
    // Question: do we need next in the post params?
    .post('/', (req, res) => {
        const studios = Array.isArray(req.body) ? req.body : [req.body];

        Promise.all(studios.map( studio => new Studio(studio).save()))
            .then( got => {
                got.length < 2 ? res.json(got[0]) : res.json(got);
            });
    })

    .get('/:id', (req, res, next) => {
        // Question should we use .lean() and what will it change
        console.log('we are in the route and id is:', req.params.id);
        Studio.findById(req.params.id)
            .then( got => res.json(got))
            .catch(next);
    });