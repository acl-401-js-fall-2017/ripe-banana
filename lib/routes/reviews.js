const router = require('express').Router();
const Review = require('../../lib/models/Review');
const Reviewer = require('../../lib/models/Reviewer'); 
const ensureAuth = require('../utils/ensure-auth');
const tokenService = require('../utils/token-service');

router
    .post('/', ensureAuth(), (req, res, next) => {
        tokenService.verify(req.headers.authorization).
            then(payload => {
                req.body.reviewer = payload.id;
        
                new Review(req.body)
                    .save()
                    .then(mongoRes => res.send(mongoRes))
                    .catch(next);
            });
    })
    .get('/', (req, res, next) => {
        Review.find({})
            .sort({updatedAt: -1})
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
    .patch('/:id', ensureAuth(), (req, res, next) => {
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
