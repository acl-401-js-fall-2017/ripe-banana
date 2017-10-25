const Router = require('express').Router;
const router = Router();
const Actor = require('../models/actor');

router

    .post('/', (req, res, next) => {
        new Actor(req.body).save()
            .then(result => res.json(result))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Actor.findById(req.params.id)
            .then(actor => {
                if (!actor) {
                    res.statusCode = 404;
                    res.send(`id ${req.params.id} does not exist`);
                } else res.json(actor);
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Actor.find()
            .then(result => res.json(result))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Actor.findOneAndUpdate((req.params.id), req.body, { new: true })
            .then(result => res.json(result))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Actor.deleteOne(req.params.id)
            .then(result => {
                if (result.deletedCount === 1) {
                    res.json({ removed: true });
                } else if (result.deletedCount === 0) {
                    res.json({ removed: false });
                }
            })
            .catch(next); 
    });




module.exports = router;
