const router = require('express').Router();
const Film = require('../../lib/models/Film');
const Review = require('../../lib/models/Review');
const ensureAuth = require('../utils/ensure-auth');
const ensureRole = require('../utils/ensure-role');


router
    .get('/',  (req, res, next) => {
        Film.find({})
            .populate('studio')
            .select('title released studio')
            .lean()
            .then(mongoRes => {
                mongoRes.forEach(film => {
                    film.studio = film.studio.name;
                });
                res.send(mongoRes);
            })
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Film.findById(req.params.id)
            .populate('studio')
            .populate('cast.actor')
            .lean()
            .then(mongoRes => {
                mongoRes.studio = mongoRes.studio.name;
                
                mongoRes.cast.forEach(castMember => {
                    castMember.actor = castMember.actor.name;
                });
                
                Review.find({film: mongoRes._id})
                    .select('rating review reviewer')
                    .lean()
                    .populate('reviewer')
                    .then(mongoRevRes => {
                        mongoRevRes.forEach(r => {
                            r.reviewer = r.reviewer.name;
                            delete r._id;
                        });
                        mongoRes.reviews = mongoRevRes;
                        res.send(mongoRes);
                    });
            })
            .catch(next);
    })
    .post('/', ensureAuth(), ensureRole('admin'), (req, res, next) => {
        new Film(req.body)
            .save()
            .then(mongoRes => res.send(mongoRes))
            .catch(next);
    })
    .delete('/:id', ensureAuth(), ensureRole('admin'), (req, res, next) => {
        Film.findByIdAndRemove(req.params.id)
            .then(mongoRes => {
                res.send({ removed: mongoRes !== null ? true : false });
            })
            .catch(next);
    })
    .patch('/:id', ensureAuth(), ensureRole('admin'), (req, res, next) => {
        Film.findByIdAndUpdate(
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