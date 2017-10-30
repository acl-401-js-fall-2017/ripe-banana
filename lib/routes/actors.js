const router = require('express').Router();
const Actor = require('../models/Actor');
const Film = require('../models/Film');
const respond = require('../respond');


router
    .post('/', respond(async req => {
        return new Actor(req.body).save();

    }))
    .get('/', respond(async () => {
        return Actor.find({})
            .select('name')
            .lean();
    }))
    .get('/:id', respond(async req => {
        const [actor, films] = await Promise.all([
            Actor.findById(req.params.id)
                .select('name dob pob')
                .lean(),
            
            Film.find({'cast.actor': req.params.id})
                .select('title released')
                .lean()
        ]);
        
        actor.films = films;
        return actor;
    }))
    .delete('/:id', respond(async req => {
        const actor = Actor.findByIdAndRemove(req.params.id);
        return actor === null ? false : true;
    }))
    .patch('/:id', respond(async req => {
        const actor = Actor.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},
            {new: true}
        )
            .lean();
        return actor;
    }));
    
module.exports = router;