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
    .post('/', (req, res, next) => {
        new Film(req.body)
            .save()
            .then(mongoRes => res.send(mongoRes));
    })
;

module.exports = router;