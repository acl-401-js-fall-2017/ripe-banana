const router = require('express').Router();
const Reviewer = require('../models/Reviewer');
const Review = require('../models/Review');
const ensureAuth = require('../utils/ensure-auth');
const ensureRole = require('../utils/ensure-role');


router
    .post('/', ensureAuth(), ensureRole('admin'), (req, res, next ) => {

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
            .then(mongoRes => {
                Review.find({reviewer: mongoRes._id})
                    .select('film rating review')
                    .lean()
                    .populate('film')
                    .then(mongoReviewerRes => {
                        mongoReviewerRes.forEach(r => {
                            r.film = r.film.title;
                            delete r._id;
                        });
                        mongoRes.reviews = mongoReviewerRes;
                        res.send(mongoRes);
                    });

            })
            .catch(next);
    })
    .delete('/:id', ensureAuth(), ensureRole('admin'), (req, res, next) => {
        Reviewer.findByIdAndRemove(req.params.id)
            .then( mongoRes => {
                res.send({removed: mongoRes === null ? false : true});
            })
            .catch(next);
    })
    .patch('/:id', ensureAuth(), ensureRole('admin'), (req, res, next) => { // eslint-disable-line
        Reviewer.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},
            {new: true}
        )
            .lean()
            .then(mongoRes => {
                res.send(mongoRes);
            });
    })
;

module.exports = router;