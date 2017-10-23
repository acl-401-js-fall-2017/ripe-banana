const router = require('express').Router();
const Film = require('../../lib/models/Film');

router
.post('/', (req, res, next) => {
    new Film(req.body)
        .save()
        .then(mongoRes => res.send(mongoRes));
})
;

module.exports = router;