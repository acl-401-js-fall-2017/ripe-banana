const router = require('express').Router();
const Reviewer = require('../models/reviewer');
const Review = require('../models/review');

module.exports = router

    .post('/', (req, res, next) => {
        new Reviewer(req.body).save()
            .then(reviewer => res.json(reviewer))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Reviewer.find()
            .select('name _id')
            .lean()
            .then(reviewers => res.json(reviewers.sort((a, b) => a._id < b._id)))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        const id = req.params.id;
        Promise.all([
            Reviewer.findById(id)
                .select('name company _id')
                .lean(),
            Review.find({ reviewer: id })
                .select('rating reviewText')
                .populate('film', 'title')
                .lean()
        ])
            .then(([reviewer, reviews]) => {
                if (!reviewer) {
                    next({ code: 404, error: `id ${id} does not exist` });
                }
                reviewer.reviews = reviews.sort((a,b) => a._id < b._id);
                res.json(reviewer);
            });
    })

    .put('/:id', (req, res, next)=>{
        const id = req.params.id;
        if (!id) {
            next({ code: 404, error: `id ${id} does not exist` });
        } 
        Reviewer.update({ _id: id }, req.body, (err, data) => res.send(data));  
    });