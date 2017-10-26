const router = require('express').Router();
const Film = require('../models/film');
const Studio = require('../models/studio');

module.exports = router

    .post('/', (req, res, next) => {
        new Studio(req.body).save()
            .then( studio => res.json(studio))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Studio.find()
            .select('name _id')
            .lean()
            .then(studio => res.json(studio))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const id = req.params.id;
        Promise.all([
            Studio.findById(id)
                .select('name address films')
                .lean(),
            Film.find({ studio: id })
                .select('title')
                .lean()
        ])
            .then(([studio, films]) => {
                if(!studio){
                    next({ code: 404, error: `id ${req.params.id} does not exist` });
                }
                studio.films = films.sort((a, b) => a._id < b._id);
                res.json(studio);
            });
    })

    .delete('/:id', (req, res, next) =>{
        let exists = false;
        let id = req.params.id;
        Film.find({ studio: id})
            .then(films => {
                if(!films.length){
                    return Studio.findByIdAndRemove(id)
                        .then(result => exists = result != null)
                        .catch(next);
                } 
            })
            .then(() => res.json({ removed: exists }));
    });