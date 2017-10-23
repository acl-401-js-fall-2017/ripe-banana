const assert = require('chai').assert;
const mongoose = require('mongoose');
const request = require('./request');

describe('actors API', () => {
    beforeEach(() => mongoose.connection.dropDatabase());

    const kevin = {
        name: 'Kevin Bacon'
    };
    const amy = {
        name: 'Amy Adams'
    };

    it('saves an actor with ID', () => {
        return request.post('/api/actors')
            .send(kevin)
            .then(res => {
                const actor = res.body;
                assert.ok(actor._id);
                assert.equal(actor.name, kevin.name);
            });
    });

    it('Gets all actors', () =>{
        const saves = [kevin, amy].map(actor =>{
            return request.post('/api/actors')
                .send(actor)
                .then(res => res.body);
        });
        let saved = null;
        let savedNames = null;
        return Promise.all(saves)
            .then(_saved => {
                saved = _saved;
                savedNames = saved.map( save => { 
                    return {
                        _id: save._id,
                        name: save.name
                    }; 
                });
                return request.get('/api/actors');
            })
            .then(res =>{
                assert.deepEqual(res.body, savedNames);
            });
    });
});