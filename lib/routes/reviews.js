const router = require('express').Router();
const Review = require('../../lib/models/Review');
const Reviewer = require('../../lib/models/Reviewer');
const Film = require('../../lib/models/Film');

router
    .post('/', (req, res, next) => {
        new Review(req.body)
            .save()
            .then(mongoRes => res.send(mongoRes))
            .catch(next);
    })
;



module.exports = router;
