const router = require('express').Router();
const Review = require('../models/review');

module.exports = router
    .post('/', (req, res, next) => {
        const reviews = Array.isArray(req.body) ? req.body : [req.body];
        Promise.all(reviews.map( review => new Review(review).save()))
            .then( got => {
                got.length < 2 ? res.json(got[0]) : res.json(got);
            })
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Review.findById(req.params.id)
            .then( got => res.send(got))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Review.find().sort({'date':-1}).limit(100)
            .then( got => res.send(got))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Review.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then ( updated => res.send(updated))
            .catch(next);
    });