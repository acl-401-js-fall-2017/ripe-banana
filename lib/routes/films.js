const Router = require('express').Router;
const router = Router();
const Film = require('../models/film');

router

    .post('/', (req, res, next) => {
        new Film(req.body).save()
            .then(film => res.json(film))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Film
            .find()
            .lean()
            .select('title _id')
            .then(films => {
                films = films.sort((a,b) => a._id < b._id); 
                res.send(films);
            })
            .catch(next);
    })
    
    .get('/:id', (req, res, next) => {
        Film
            .findById(req.params.id)
            .lean()
            .select('title studio')
            .populate({
                path: 'studio',
                select: 'name'
            })
            .then(film => res.send(film))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        const id = req.params.id;
        if (!id) {
            next({ code: 404, error: `id ${req.params.id} does not exist`});
        }
        else {
            Film.update({_id: id}, req.body, function(err, data) {
                res.send(data);
            });
        }
    });

module.exports = router;

