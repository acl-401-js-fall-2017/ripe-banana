const router = require('express').Router();
const Actor = require('../models/actor');
const Film = require('../models/film');

module.exports = router

    .post('/', (req, res, next) => {
        new Actor(req.body).save()
            .then(actor => res.json(actor))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Promise.all([
            Actor.find()
                .select('name _id')
                .lean(),
            Film.movieCount()
        ])
            .then(([actors, filmCount]) => {
                filmCount = filmCount.sort((a, b) => a._id < b._id);
                actors = actors.sort((a, b) => a._id < b._id);
                for(let i = 0; i < filmCount.length; i++){
                    actors[i].movieCount = filmCount[i].tags;
                }
                res.json(actors);
            })
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const id = req.params.id;
        Promise.all([
            Actor.findById(id)
                .select('name dob pob')
                .lean(),
            Film.find({ 'cast.actor': id})
                .select('title')
                .lean()
        ])
            .then(([actor, films]) => {
                actor ? actor.films = films : next({ code: 404, error: `id ${id} does not exist` });
                if (actor) res.json(actor);
            })
            .catch(next);
    })

    .put('/:id', (req, res, next) =>{
        const id = req.params.id;
        id ? Actor.update({ _id: id}, req.body, (err, actor) => res.send(actor)) :
            next({ code: 404, error: `id ${id} does not exist`}); 
    })

    .delete('/:id', (req, res, next) =>{
        let exist = false;
        let id = req.params.id;
        return Film.find({ 'cast.actor': id })
            .then(res => {
                if (!res.length) {
                    return Actor.findByIdAndRemove(id)
                        .then(result => {
                            exist = result != null;
                        })
                        .catch(next);
                }
            })
            .then(() => res.json({ removed: exist }));
    });