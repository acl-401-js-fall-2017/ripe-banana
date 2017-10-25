const express = require('express');
const router = express.Router();
const Film = require('../models/film');

const Studio = require('../models/studio');

router

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
        Promise.all([
            Studio.findById(req.params.id)
                .select('name address films')
                .lean(),
            Film.find({ studio: req.params.id })
                .select('title')
                .lean()
        ])
            .then(([studioData, filmDAta]) => {
                if(!studioData){
                    next({ code: 404, error: `id ${req.params.id} does not exist` });
                }
                else {
                    studioData.films = filmDAta.sort((a,b) => a._id < b._id);
                    res.json(studioData);
                }
            });
    })

    .delete('/:id', (req, res, next) =>{
        let exist = false;
        Film.find({ studio: req.params.id})
            .then(res => {
                let count = res.length; 
                if(!count){
                    return Studio.findByIdAndRemove(req.params.id)
                        .then(result => {
                            exist = result != null;     
                        })
                        .catch(next);
                }
            })
            .then(() => {
                res.json({ removed: exist });
            });
    });



    
module.exports = router;