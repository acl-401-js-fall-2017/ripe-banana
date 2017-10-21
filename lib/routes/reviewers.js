const router = require('express').Router();
const Reviewer = require('../models/Reviewer');

router
    .post('/', (req, res, next ) => {
        new Reviewer(req.body)
            .save()
            .then(mongoRes => res.send(mongoRes))
            .catch(next);
    })
;

module.exports = router;