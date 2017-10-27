const router = require('express').Router();
const Reviewer = require('../models/reviewer');
const Review = require('../models/review');
const checkAuth = require('../utils/check-auth');
const checkRole = require('../utils/check-role');

module.exports = router
    .get('/', (req, res, next) => {
        Reviewer.find()
            .select('name company')
            .lean()
            .then( got => res.json(got)) 
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Promise.all([
            Review.find({reviewer: req.params.id})
                .lean()
                .populate('film', 'title')
                .select('film.title rating review'),
            Reviewer.findById(req.params.id).lean()
        ])
            .then( ([ reviews, reviewer ]) =>{
                reviewer.reviews = reviews;
                res.send(reviewer);
            })
            .catch(next);
    })

    .put('/:id',checkAuth(), checkRole('admin'), (req, res, next) => {
        Reviewer.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then( updated => res.send(updated) )
            .catch(next);
    });