const router = require('express').Router();
const Studio = require('../models/studio');
const Film = require('../models/film');
const checkAuth = require('../utils/check-auth');
const checkRole = require('../utils/check-role');

module.exports = router
    .post('/',checkAuth(), checkRole('admin'), (req, res, next) => {
        const studios = Array.isArray(req.body) ? req.body : [req.body];

        Promise.all(studios.map( studio => new Studio(studio).save()))
            .then( got => {
                got.length < 2 ? res.json(got[0]) : res.json(got);
            })
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Studio.findById(req.params.id)
            .select('name')
            .lean()
            .then( got => {
                Film.find({studio: got._id})
                    .then(film => got.film = film)
                    .then ( () => res.json(got));
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Studio.find()
            .select('name')
            .lean()
            .then( got => res.json(got)) 
            .catch(next);
    })

    .put('/:id',checkAuth(), checkRole('admin'), (req, res, next) => {
        Studio.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then( updated => {
                res.send(updated);
            })
            .catch(next);
    })

    .delete('/:id',checkAuth(), checkRole('admin'), (req,res, next) => {
        Film.find({studio: req.params.id })
            .then( found => {
                if (found.length>0){
                    res.send( {deleted: 'delete films first'} );
                }
                else{Studio.findByIdAndRemove(req.params.id)
                    .then( deleted => {
                        res.send(deleted);
                    });
                }
            })
            .catch(next);
    });