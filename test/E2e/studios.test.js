const assert = require('chai').assert;
const mongoose = require('mongoose');
const request = require('./request');

describe('studios API', () => {
    beforeEach(() => mongoose.connection.dropDatabase());

    const warner = {
        name: 'Warner'
    };
    const fox = {
        name: 'Fox'
    };

    it('saves a studio with ID', () => {
        return request.post('/api/studios')
            .send(warner)
            .then(res => {
                const studio = res.body;
                assert.ok(studio._id);
                assert.equal(studio.name, warner.name);
            });
    });

    it('Gets all studios', () =>{
        const saves = [ warner, fox].map(studio =>{
            return request.post('/api/studios')
                .send(studio)
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
                return request.get('/api/studios');
            })
            .then(res =>{
                assert.deepEqual(res.body, savedNames);
            });
    });
});