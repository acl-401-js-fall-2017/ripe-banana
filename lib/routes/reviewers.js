const router = require('express').Router();
const Reviewer = require('../models/Reviewer');

router
    .post('/', (req, res, next ) => {
        new Reviewer(req.body)
            .save()
            .then(mongoRes => res.send(mongoRes))
            .catch(next);
    })
    .get('/', (req, res, next) => {
        Reviewer.find({})
            .select('name')
            .lean()
            .then(mongoRes => res.send(mongoRes))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Reviewer.findById(req.params.id)
            .select('name company')
            .lean()
            .then(mongoRes => res.send(mongoRes))
            .catch(next);
    })
;

module.exports = router;