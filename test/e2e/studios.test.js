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

    it('Post saves a studio with ID', () => {
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

    it('Gets studios by ID, with films', () =>{
        let juno =null;
        let studio = null;

        return request.post('/api/studios')
            .send(warner)
            .then(res => {
                studio = res.body;
                juno = {
                    title: 'juno',
                    studio: studio._id,
                    released: 2002
                };
                return request.post('/api/films')
                    .send(juno)
                    .then(() =>{
                        const id = studio._id;             
                        return request.get(`/api/studios/${id}`)
                            .then(studio =>{
                                studio = studio.body;
                                assert.ok(studio.films);
                                assert.deepEqual('juno', studio.films[0].title);
                            });
                    });
            });
    });

    it('deletes studio by ID', () => {
        let studio = null;
        return request.post('/api/studios')
            .send(warner)
            .then(res => {
                studio = res.body;
                return request.delete(`/api/studios/${studio._id}`);
            })
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
            });
            
    });

});