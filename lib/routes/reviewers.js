const Router = require('express').Router;
const router = Router();
const Reviewer = require('../models/reviewer');

router

    .post('/', (req, res, next) => {
        new Reviewer(req.body).save()
            .then(result => res.json(result))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Reviewer.findById(req.params.id)
            .then(reviewer => {
                if(!reviewer){
                    res.statusCode = 404;
                    res.send( `id ${req.params.id} does not exist`);
                }else res.json(reviewer);
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Reviewer.find()
            .then(result => res.json(result))
            .catch(next);
    })
    
    .put('/:id', (req, res, next) => {
        Reviewer.findOneAndUpdate((req.params.id), req.body, {new: true})
            .then(result => res.json(result))
            .catch(next);
    });



module.exports = router;