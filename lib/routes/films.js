const router = require('express').Router();
const Film = require('../models/film');
const Review = require('../models/review');

module.exports = router

    .post('/', (req, res, next) => {
        new Film(req.body)
            .save()
            .then(film => res.json(film))
            .catch(next);
    })
    

    .get('/', (req, res, next) => {

        Promise.all([
            Film
                .find()
                .lean()
                .select('title _id released')
                .populate({
                    path: 'studio',
                    select: 'name'
                }),
            Review
                .avgRating()
        ])
            .then(([films, avgRatings]) => {
                films = films.sort((a, b) => a._id < b._id);
                avgRatings = avgRatings.sort((a, b) => a._id < b._id);
                films = films.map((film, index) => {
                    film.averageRating = avgRatings[index].avgRating;
                    return film;
                });
                films.avgerageRating = avgRatings;
                res.send(films);
            })
            .catch(next);
    })

    .get('/top', (req, res, next)=> {
        Promise.all([
            Film
                .find()
                .lean()
                .select('title _id released')
                .populate({
                    path: 'studio',
                    select: 'name'
                }),
            Review
                .avgRating(7)
        ])
            .then(([films, avgRatings]) => {
                films = films.sort((a, b) => a._id < b._id);
                avgRatings = avgRatings.sort((a, b) => a._id < b._id);
                films = films.map((film, index) => {
                    film.averageRating = avgRatings[index].avgRating;
                    return film;
                });
                films = films.sort((a, b) => a.averageRating < b.averageRating);
                let topFilms = [];
                for(let i = 0; i < 10; i++){
                    topFilms.push(films[i]);
                }
                console.log('i am the fimls oming with avg rating', topFilms);
                res.send(topFilms);
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