const express = require('express');
const router = express.Router();

const Reviewer = require('../models/reviewer');
const Review = require('../models/review');

router
    .post('/', (req, res, next) => {
        new Reviewer(req.body).save()
            .then(reviewer => res.json(reviewer))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Reviewer.find()
            .select('name _id')
            .lean()
            .then(reviewer => {
                reviewer = reviewer.sort((a, b) => a._id < b._id);
                res.json(reviewer);
            })
            .catch(next);
    })
    .get('/:id', (req, res, next) => {

        const reviewerId = req.params.id;

        Promise.all([
            Reviewer.findById(req.params.id)
                .select('name _id')
                .lean(),
            Review.find({ reviewer: reviewerId })
                .select()
                .lean()
        ])
            .then(([reviewer, reviews]) => {
                if (!reviewer) {
                    next({ code: 404, error: `id ${req.params.id} does not exist` });
                }
                else {
                    reviewer.reviews = reviews.sort((a,b) => a.createdAt < b.createdAt);
                    res.json(reviewer);
                }
            });
    })

    .put('/:id', (req, res, next)=>{
        const id = req.params.id;
        if (!id) {
            next({ code: 404, error: `id ${id} does not exist` });
        } else {
            Reviewer.update({ _id: id }, req.body, function (err, data) {
                res.send(data);
            });
        }
    });



module.exports = router;