const assert = require('chai').assert;
const mongoose = require('mongoose');
const request = require('./request');

describe('films API', ()=> {
    beforeEach(() => mongoose.connection.dropDatabase());

    let studio = { 
        name: 'Warner',
        address: {
            city: 'Hollywood',
            state: 'CA'
        }
    };

    const frozen = {
        name: 'frozen'
    };
    const juno = {
        name: 'juno'
    };

    before(() => {
        return request.post('/api/studios')
            .send(studio)
            .then( res => res.body)
            .then(saved => studio = saved);
    });


    it('POST should add a film', () => {
        titanic.studio = studio._id;
        return request.post('/api/films')
            .send(titanic)
            .then(res => res.body)
            .then(saved => {
                assert.ok(saved._id);

                titanic = saved;
            });
    });

    it('first GET should return empty array', () => {
        return request.get('/api/films')
            .then(res => res.body)
            .then(films => assert.deepEqual(films, []));
    });

    let titanic = { title: 'Titanic', studio: '590643bc2cd3da2808b0e651', released: 1998 };    

    it('Gets all studios', () =>{
        const saves = [ frozen, juno].map(film =>{
            return request.post('/api/films')
                .send(film)
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
                        name: save.name,
                        studio: save.studio
                    }; 
                });
                return request.get('/api/studios');
            })
            .then(res =>{
                assert.deepEqual(res.body, savedNames);
            });
    });
});
