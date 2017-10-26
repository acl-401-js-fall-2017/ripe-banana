const router = require('express').Router();
const Reviewer = require('../models/reviewer');
const Review = require('../models/review');

module.exports = router

    .post('/', (req, res, next) => {
        const reviewers = Array.isArray(req.body) ? req.body : [req.body];
        Promise.all(reviewers.map( reviewer => new Reviewer(reviewer).save()))
            .then( got => {
                got.length < 2 ? res.json(got[0]) : res.json(got);
            })
            .catch(next);
    })

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

    .put('/:id', (req, res, next) => {
        Reviewer.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then( updated => res.send(updated) )
            .catch(next);
    });