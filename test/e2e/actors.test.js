const request = require('./request');
const mongoose = require('mongoose');
const assert = require('chai').assert;


describe('Actors API', () => {
    
    beforeEach(() => mongoose.connection.dropDatabase());

    const actor = {
        name: 'George Clooney',
        dob: 1961,
        pob: 'Lexington KY'
    };

    it('saves an actor', () => {
        return request.post('/api/filmIndustry/actors')
            .send(actor)
            .then(({ body }) => {
                assert.equal(body.name, actor.name);
            });
    });

    it('get actor with an id', () => {
        let savedActor =null;
        return request.post('/api/filmIndustry/actors')
            .send(actor)
            .then(res => {
                savedActor = res.body;
                // console.log('actor id', res.body._id);
                return request.get(`/api/filmIndustry/actors/${savedActor._id}`);
            })
            .then(res => {
                assert.deepEqual(res.body, savedActor);
            });
    });

});
