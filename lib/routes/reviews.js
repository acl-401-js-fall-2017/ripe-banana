const router = require('express').Router();
const Review = require('../../lib/models/Review');
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
        const reviewerAuth = tokenService.verify(req.headers.authorization).then(payload => payload.id);
        const reqReviewer = Review.findById(req.params.id).then(mongoRes => {
            return Buffer.from(mongoRes.reviewer.id).toString('hex');
        });
        
        return Promise.all([reviewerAuth, reqReviewer])
            .then(([reviewerAuth, reqReviewer]) => {
                if(reviewerAuth === reqReviewer) 
                    Review.findByIdAndUpdate(
                        req.params.id,
                        {$set: req.body},
                        {new: true}
                    )
                        .lean()    
                        .then(mongoRes => res.send(mongoRes))
                        .catch(next);
                else
                    res.send( {code: 404, error: 'review may only be edited by poster'});
            });
    })

;



module.exports = router;
