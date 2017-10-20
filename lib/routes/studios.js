const express = require('express');
const router = express.Router();
const Studio = require('../models/Studio');


router  
    .post('/', (req, res, next) => {
        new Studio(req.body)
            .save()
            .then(mongoRes => {
                res.send(mongoRes);
            })
            .catch(next);
    })
    .get('/', (req, res, next) => {
        Studio.find({})
            .then(mongoRes => {
                res.send(mongoRes);
            })
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Studio.findById(req.params.id)
            .then(mongoRes => res.send(mongoRes))
            .catch(next);
    })
    .delete('/:id', (req, res, next) => {
        Studio.findByIdAndRemove(req.params.id)
            .then(result => {
                const exit = result != null;
                res.json({removed: exit});
            })
            .catch(next);
    });

module.exports = router;