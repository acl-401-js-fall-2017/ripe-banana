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
    let juno = null;

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

                juno = {
                    title: 'juno', 
                    studio: studio._id,
                    released: 2002
                };
            });
    });


    const frozen = {
        title: 'frozen',
        studio: 'fox',
        released: 2015
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

    
    it('GET by id should return title and studio fields', () => {
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

    it.only('GETS all films', () => {
        const saves = [titanic, juno].map( savedFilm => {
            return request.post('/api/films')
                .send(savedFilm)
                .then(res => res.body);
        });

        let saved = null;

        return Promise.all(saves)
            .then(_saved => {
                saved = _saved;
                savedData = saved.map(save => {
                    return {
                        _id: save._id,
                        title: save.title
                    };
                });
                return request.get('/api/films');
            })
            .then(res => {
                let sortedSavedData = savedData.sort((a,b) => a._id < b._id);
                assert.deepEqual(res.body, sortedSavedData);
            });

    });

    
});
