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

    })

    .put('/:id', (req, res, next) =>{
        const id = req.params.id;
        if(!id){
            next({ code: 404, error: `id ${id} does not exist`});
        } else {
            Actor.update({ _id: id}, req.body, function (err, data){
                res.send(data);
            });
        }
    })

    .delete('/:id', (req, res, next) =>{
        Actor.findByIdAndRemove(req.params.id)
            .then(result =>{
                const exist = result != null;
                res.json({removed: exist});
            })
            .catch(next);
    });

module.exports = router;