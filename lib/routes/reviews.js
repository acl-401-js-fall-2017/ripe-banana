// const Router = require('express').Router;
// const router = Router();
// const Review = require('../models/review');

// router

//     .post('/', (req, res, next) => {
//         new Review(req.body).save()
//             .then(result => res.send(result))
//             .catch(next);
//     })

//     .get('/:id', (req, res, next) => {
//         Review.findById(req.params.id)
//             .lean()
//             .then(result =>{
//                 res.json(result);
//             })
//             .catch(next);
//     });


// module.exports = router;