const assert = require('chai').assert;
const mongoose = require('mongoose');
const request = require('./request');

describe('films API', ()=> {

    let studio = { 
        name: 'Warner',
        address: {
            city: 'Hollywood',
            state: 'CA'
        }
    };

    let titanic = null;

    beforeEach(() => {
        mongoose.connection.dropDatabase();
       
        
        return request.post('/api/studios')
            .send(studio)
            .then( res => res.body)
            .then(saved => {
                studio = saved;
            
                titanic = { 
                    title: 'Titanic', 
                    studio: studio._id, 
                    released: 1998 };    
            });
    });


    const frozen = {
        title: 'frozen',
        studio: 'fox',
        released: 2015
    };
    const juno = {
        title: 'juno', 
        studio: 'warner',
        released: 2002
    };



    it('POST should add a film', () => {
        
        return request.post('/api/films')
            .send(titanic)
            .then(res => {
                const film = res.body;
                assert.ok(film._id);
                assert.equal(film.title, titanic.title);
            });
            
    });

    it('first GET should return empty array', () => {
        return request.get('/api/films')
            .then(res => res.body)
            .then(films => assert.deepEqual(films, []));
    });

    
    it.only('GET by id should return title and studio fields', () => {
        return request.post('/api/films')
            .send(titanic)
            .then(film => {
                film = film.body;
                console.log('%%%%%%%%%%%%%%%%%%%%%%', film);
                return request.get(`/api/films/${film._id}`)
                    .then(res => res.body)
                    .then(film => {
                        assert.propertyVal(film, 'title', 'Titanic');
                        assert.propertyVal(film.studio, 'name', 'Warner');
                    });
                
            });
    });
    
});
