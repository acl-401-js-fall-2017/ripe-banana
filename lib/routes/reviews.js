const express = require('express');
const router = express.Router();

const Review = require('../models/review');

router
    .post('/', (req, res, next) =>{
        new Review(req.body).save()
            .then(review => res.json(review))
            .catch(next);
    })

    .get('/', (req, res, next)=>{
        Review.find()
            .select('rating reviewText')
            .lean()
            .then(review => res.json(review))
            .catch(next);
    })

    .put('/:id', (req, res, next)=>{
        const id = req.params.id;
        if (!id) {
            next({ code: 404, error: `id ${req.params.id} does not exist` });
        } else {
            Review.update({ _id: id }, req.body, function (err, data) {
                res.send(data);
            });
        }
    });

module.exports = router;