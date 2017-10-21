const Router = require('express').Router;
const router = Router();
const Film = require('../models/film');

router

    .post('/', (req, res, next) => {
        new Film(req.body).save()
            .then(film => res.json(film))
            .catch(next);
    })

    .get('/', (req,res, next) => {
        Film   
            .find()
            .lean()
            .select('title studio released')
            .populate({
                path: 'studio',
                select: 'name'
            })
          
            .then(film => res.json(film))
            .catch(next);
    });


module.exports = router;

//   .populate({
//     path: 'released',
//     select: 'name',
// })