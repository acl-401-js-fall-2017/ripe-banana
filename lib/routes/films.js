const Router = require('express').Router;
const router = Router();
const Film = require('../models/film');

router

    .post('/', (req, res, next) => {
        new Film(req.body).save()
            .then(result => res.json(result))
            .catch(next);

    })

    .get('/', (req, res) => {
        Film.find()
            .then(films => res.json(films));
    })

    .get('/:id', (req, res, next) => {
        Film.findById(req.params.id)
            .then(film => res.json(film))
            .catch(next);
    });



module.exports = router;

