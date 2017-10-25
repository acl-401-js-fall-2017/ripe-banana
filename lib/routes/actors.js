const router = require('express').Router();
const Actor = require('../models/Actor');
const Film = require('../models/Film');


router
    .post('/', (req, res, next) => {
        new Actor(req.body)
            .save()
            .then(mongoRes => res.send(mongoRes))
            .catch(next);
    })
    .get('/', (req, res, next) => {
        Actor.find({})
            .select('name')
            .lean()
            .then(mongoRes => res.send(mongoRes))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Actor.findById(req.params.id)
            .select('name dob pob')
            .lean()
            .then(mongoRes => {
                return Film.find({'cast.actor': mongoRes._id})
                    .then(films => {
                        mongoRes.films = films.map(film => ({title: film.title, released: film.released}));
                        res.send(mongoRes);
                    });
            })
            .catch(next);
    })
    .delete('/:id', (req, res, next) => {
        Actor.findByIdAndRemove(req.params.id)
            .then(mongoRes => {
                res.send({removed: mongoRes === null ? false : true});
            })
            .catch(next);
    })
    .patch('/:id', (req, res, next) => {
        Actor.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},
            {new: true}
        )
            .lean()
            .then(mongoRes => res.send(mongoRes))
            .catch(next);
    });
    
module.exports = router;