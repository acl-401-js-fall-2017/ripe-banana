const express = require('express');
const router = express.Router();
const Film = require('../models/film');
const Actor = require('../models/actor');

router

    .post('/', (req, res, next) => {
        new Actor(req.body).save()
            .then(actor => res.json(actor))
            .catch(next);

    })

    .get('/', (req, res, next) => {
        Actor.find()
            .select('name _id')
            .lean()
            .then(actor => res.json(actor))
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
            .then(([actor, film]) => {
                if (!actor) {
                    res.statusCode = 404;
                    res.send({ code: 404, error: `id ${req.params.id} does not exist` });
                } else {
                    actor.films = film;
                    
                    res.json(actor);
                }
            })
            .catch(next);

    })

    .put('/:id', (req, res, next) =>{
        const id = req.params.id;
        if(!id){
            next({ code: 404, error: `id ${id} does not exist`});
        } else {
            Actor.update({ _id: id}, req.body, function (err, data){
                res.send(data);
            });
        }
    })

    .delete('/:id', (req, res, next) =>{
        let exist = false;
        let id = req.params.id;
        return Film.find({ 'cast.actor': id })
            .then(res => {
                let count = res.length;
                if (!count) {
                    return Actor.findByIdAndRemove(req.params.id)
                        .then(result => {
                            exist = result != null;
                        })
                        .catch(next);
                }
            })
            .then(() => {
                res.json({ removed: exist });
            });
    });

module.exports = router;