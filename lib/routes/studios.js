const Router = require('express').Router;
const router = Router();
const Studio = require('../models/studio');
const Film = require('../models/film');

router

    .post('/', (req, res, next) => {
        new Studio(req.body).save()
            .then(result => res.json(result))
            .catch(next);

    })

    .get('/', (req, res, next) => {
        Studio.find()
            .select('name')
            .then(studios => {
                res.json(studios);
            })
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const studioId = req.params.id;
        
        Promise.all([
            Studio.findById(studioId).select('name address').lean(),
            Film.find({ studio: studioId }).select('title').lean()
        ])
            .then(([studio, films]) => {   
                studio.films = films.map(film => film.title);
                res.json(studio);
            })
            .catch(next);
    })


    .put('/:id', (req, res, next) => {
        Studio.findOneAndUpdate((req.params.id), req.body, { new: true })
            .then(result => res.json(result))
            .catch(next);
    })

    .delete('/:id', (req, res) => {
        Studio.findByIdAndRemove((req.params.id), req.body)
            .then(result => {
                const exists = result != null;
                res.json({ removed: exists });
            });
    });

module.exports = router;