const router = require('express').Router();
const Film = require('../models/film');

module.exports = router

    .post('/', (req, res, next) => {
        new Film(req.body)
            .save()
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
        const id = req.params.id;
        Film
            .findById(id)
            .select('title cast')
            .populate({
                path: 'studio',
                select: 'name'
            })
            .populate({
                path: 'cast.actor',
                select: 'name'
            })
            .then(film => {
                if (!film) {
                    res.statusCode = 404;
                    res.send({ error: `id ${id} does not exist` });
                    return;
                }
                res.send(film);
            })
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        const id = req.params.id;
        if (!id) {
            next({ code: 404, error: `id ${id} does not exist`});
        }
        Film.update({ _id: id }, req.body, (err, data) => res.send(data));
    })

    .delete('/:id', (req, res, next) => {
        Film.findByIdAndRemove(req.params.id)
            .then(result => {
                const exist = result !=null;
                res.json({removed: exist });
            })
            .catch(next);
    });