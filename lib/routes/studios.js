const Router = require('express').Router;
const router = Router();
const Studio = require('../models/studio');

router

    .post('/', (req, res, next) => {
        new Studio(req.body).save()
            .then(result => res.json(result))
            .catch(next);

    })

    .get('/:id', (req, res, next) => {
        Studio.findById(req.params.id)
            .then(studio => {
                if (!studio) {
                    res.statusCode = 404;
                    res.send(`id ${req.params.id} does not exist`);
                } else res.json(studio);
            })
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Studio.findOneAndUpdate((req.params.id), req.body, { new: true })
            .then(result => res.json(result))
            .catch(next);
    });

module.exports = router;