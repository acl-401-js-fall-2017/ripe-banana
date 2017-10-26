const Router = require('express').Router;
const router = Router();
const Actor = require('../models/actor');
const Film = require('../models/film');

router

    .post('/', (req, res, next) => {
        new Actor(req.body).save()
            .then(result => res.json(result))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const actorId = req.params.id;
        
        Promise.all([
            Actor.findById(actorId).select('name dob pob').lean(),
            Film.find({ 'cast.actor': actorId }).select('title released').lean()
        ])
            .then(([actor, films]) => {
                actor.films = films.map(film => [film.title, film.released]);
                res.json(actor);
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Actor.find()
            .populate({path: 'actor', select: 'name'})
            .then(result => res.json(result))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Actor.findOneAndUpdate((req.params.id), req.body, { new: true })
            .populate({ path: 'film', select: 'title'})
            .then(result => res.json(result))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Actor.deleteOne(req.params.id)
            .then(result => {
                if (result.deletedCount === 1) {
                    res.json({ removed: true });
                } else if (result.deletedCount === 0) {
                    res.json({ removed: false });
                }
            })
            .catch(next); 
    });




module.exports = router;
