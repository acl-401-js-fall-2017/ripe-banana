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
        name: 'frozen',
        studio: 'fox',
        released: 2015
    };
    const juno = {
        name: 'juno', 
        studio: 'warner',
        released: 2002
    };
    let titanic = { title: 'Titanic', studio: 'fox', released: 1998 };    

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

    
    it('GET by id should return title and studio fields', () => {
    
        return request.get(`/api/films/${titanic._id}`)
            .then(res => res.body)
            .then(film => {
                assert.propertyVal(film, 'title', 'juno');
                assert.propertyVal(film.studio, 'name', 'fox');
            });
    });
    
});
