const router = require('express').Router();
const Film = require('../../lib/models/Film');

router
    .get('/', (req, res, next) => {
        Film.find({})
            .populate('studio')
            .select('title released studio')
            .lean()
            .then(mongoRes => {
                mongoRes.forEach(film => {
                    film.studio = film.studio.name;
                })
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
                res.send(mongoRes);
            })
            .catch(next)
        })
    .post('/', (req, res, next) => {
        new Film(req.body)
            .save()
            .then(mongoRes => res.send(mongoRes))
            .catch(next);
    })
    .delete('/:id', (req, res, next) => {
        Film.findByIdAndRemove(req.params.id)
            .then(mongoRes => {
                res.send({ removed: mongoRes !== null ? true : false });
            })
            .catch(next);
    });
;

module.exports = router;