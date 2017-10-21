const router = require('express').Router();
const Actor = require('../models/Actor');

router
    .post('/', (req, res, next) => {
        new Actor(req.body)
            .save()
            .then(mongoRes => res.send(mongoRes))
            .catch(next);
    })
    .get('/', (req, res, next) => {
        Actor.find({})
            .select('name')
            .lean()
            .then(mongoRes => res.send(mongoRes))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Actor.findById(req.params.id)
            .select('name dob pob')
            .lean()
            .then(mongoRes => res.send(mongoRes))
            .catch(next);
    })
    .delete('/:id', (req, res, next) => {
        Actor.findByIdAndRemove(req.params.id)
            .then(mongoRes => {
                res.send({removed: mongoRes === null ? false : true});
            })
            .catch(next);
    })
;
    
module.exports = router;