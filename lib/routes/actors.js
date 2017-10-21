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
            // .populate('actor')
            // .populate('name','dob','pob')
            
            .then(actor => {
                if(!actor){
                    res.statusCode = 404;
                    res.send( `id ${req.params.id} does not exist`);
                }else res.json(actor);
            })
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Actor.findOneAndUpdate((req.params.id), req.body, {new: true})
            .then(result => res.json(result))
            .catch(next);
    });

module.exports = router;
