const express = require('express');
const router = express.Router();

const Actor = require('../models/actor');

router

    .post('/', (req, res, next) => {
        new Actor(req.body).save()
            .then(actor => res.json(actor))
            .catch(next);

    })

    .get('/', (req, res, next) => {
        Actor.find()
            .select('name _id')
            .lean()
            .then(actor => res.json(actor))
            .catch(next);

    })

    .get('/:id', (req, res) => {
        const id = req.params.id;
        Actor.findOne({ _id: (id) })
            .then(savedObj => {
                if (!savedObj) {
                    res.statusCode = 404;
                    res.send({ error: `id ${id} does not exist` });
                    return;
                }
                res.send(savedObj);
            })
            .catch(console.error);

    });




module.exports = router;