const router = require('express').Router();
const Reviewer = require('../models/reviewer');

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
            .then( (got) => res.json(got)) 
            .catch(next);
    });