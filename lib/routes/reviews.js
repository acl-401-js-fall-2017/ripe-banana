const router = require('express').Router();
const Review = require('../models/review');

module.exports = router

    .post('/', (req, res, next) =>{
        new Review(req.body).save()
            .then(review => res.json(review))
            .catch(next);
    })

    .get('/', (req, res, next)=>{
        Review.find()
            .select('rating reviewText')
            .populate('film', 'title')
            .lean()
            .then(review => res.json(review.sort((a, b) => a._id < b._id)))
            .catch(next);
    })

    .put('/:id', (req, res, next)=>{
        const id = req.params.id;
        if (!id) {
            next({ code: 404, error: `id ${id} does not exist` });
        } 
        Review.update({ _id: id }, req.body, (err, data)=> res.send(data));
    });

