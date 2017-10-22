const express = require('express');
const router = express.Router();

const Reviewer = require('../models/reviewer');

router
    .post('/', (req, res, next) => {
        new Reviewer(req.body).save()
            .then(reviewer => res.json(reviewer))
            .catch(next);
    })

    .get('/', (req, res, next)=>{
        Reviewer.find()
            .select('name _id')
            .lean()
            .then(reviewer => res.json(reviewer))
            .catch(next);
    })
    .get('/:id', (req, res, next)=>{
        Reviewer.findById(req.params.id)
            .select('name _id')
            .lean()
            .then(reviewer =>{
                if(!reviewer){
                    next({code: 404, error:`id ${req.params.id} does not exist`});
                }
                else res.json(reviewer);
            });
    });



module.exports = router;