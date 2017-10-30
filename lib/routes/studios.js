const express = require('express');
const router = express.Router();
const Studio = require('../models/Studio');
const Film = require('../models/Film');
const ensureAuth = require('../utils/ensure-auth');
const ensureRole = require('../utils/ensure-role');


router  
    .post('/', ensureAuth(), ensureRole('admin'), (req, res, next) => {
        new Studio(req.body)
            .save()
            .then(mongoRes => {
                res.send(mongoRes);
            })
            .catch(next);
    })
    .get('/', (req, res, next) => { 
        Studio.find({})
            .select('name')
            .lean()
            .then(mongoRes => { 
                res.send(mongoRes);
            })
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Studio.findById(req.params.id)
            .lean()
            .then(studioRes => {
                Film.find({ studio: studioRes._id })
                    .then(filmRes => {
                        studioRes.films = filmRes.map(film => film.title);
                        res.send(studioRes);
                    });
            
            })
            .catch(next);
    })
    .delete('/:id', ensureAuth(), ensureRole('admin'), (req, res, next) => {
        Studio.findByIdAndRemove(req.params.id)
            .then(result => {
                const exit = result != null;
                res.json({removed: exit});
            })
            .catch(next);
    })
    .patch('/:id', ensureAuth(), ensureRole('admin'), (req, res, next) => {
        Studio.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},
            {new: true}
        )  
            .lean()
            .then(mongoRes => res.send(mongoRes))
            .catch(next);
    });

module.exports = router;