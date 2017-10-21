const mongoose = require('mongoose');
const router = require('express').Router();
const Actor = require('../models/Actor');

router
    .post('/', (req, res, next) => {
        new Actor(req.body)
            .save()
            .then(mongoRes => res.send(mongoRes))
            .catch(next);
    })
;
    


module.exports = router;