const Router = require('express').Router;
const router = Router();
const Actor = require('../models/actor');

router

    .post('/', (req, res, next) => {
        new Actor(req.body).save()
            .then(result => res.json(result))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Actor.findById(req.params.id)
            // .populate('actor')
            // .populate('name','dob','pob')
            .lean()
            .then(actor => res.json(actor))
            .catch(next);
    });

module.exports = router;
