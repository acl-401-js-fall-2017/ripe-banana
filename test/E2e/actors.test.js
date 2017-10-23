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

    it.skip('Gets Actor with id', () => {
        const bob = { name: 'Bob Saget' };
        let actor = null;
        return request.post('/api/actors')
            .send(bob)
            .then(res => {
                actor = res.body;
                return request.get(`/api/actors/${actor._id}`);
            })
            .then(res => {
                assert.deepEqual(res.body, actor);
            });
    });

    it.skip('Get by ID returns 404 for bad id', () => {
        return request.get('/api/actors/59e401db548d1096dde508b9')
            .then(
                () => {throw new Error('Incorrect ID'); },
                err => {
                    assert.equal(err.status, 404);
                });
    });

    
});