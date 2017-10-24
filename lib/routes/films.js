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
            .select('title studio cast')
            .populate({
                path: 'studio',
                select: 'name'
            })
            .populate({
                path: 'cast.actor',
                select: 'name'
            })
            .then(savedObj => {
                if (!savedObj) {
                    res.statusCode = 404;
                    res.send({ error: `id ${req.params.id} does not exist` });
                    return;
                }
                res.send(savedObj);
            })
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
    })

    .delete('/:id', (req, res, next) => {
        Film.findByIdAndRemove(req.params.id)
            .then(result => {
                const exist = result !=null;
                res.json({removed: exist });
            })
            .catch(next);
    });

module.exports = router;

