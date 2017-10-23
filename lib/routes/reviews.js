const router = require('express').Router();
const Review = require('../../lib/models/Review');
const Reviewer = require('../../lib/models/Reviewer'); // eslint-disable-line
const Film = require('../../lib/models/Film'); // eslint-disable-line

router
    .post('/', (req, res, next) => {
        new Review(req.body)
            .save()
            .then(mongoRes => res.send(mongoRes))
            .catch(next);
    })
    .get('/', (req, res, next) => {
        Review.find({})
            .limit(100)
            .select('rating review film')
            .populate('film')
            .lean()
            .then(mongoRes => {
                mongoRes.forEach(rev => {
                    rev.film = rev.film.title;
                });
                res.send(mongoRes);
            })
            .catch(next);
    })
    .patch('/:id', (req, res, next) => {
        Review.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},
            {new: true}
        )
            .lean()    
            .then(mongoRes => res.send(mongoRes))
            .catch(next);
    })

;



module.exports = router;
