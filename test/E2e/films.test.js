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
                    released: 1998 
                    
                };  

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
                
                return request.get(`/api/films/${film._id}`)
                    .then(res => res.body)
                    .then(film => {
                        assert.propertyVal(film, 'title', 'Titanic');
                        assert.propertyVal(film.studio, 'name', 'Warner');
                        assert.propertyVal(
                            film, 'cast',
                            [{ part: 'Jack Dawson', actor_id: '' },
                                { part: 'Rose DeWitt Bukater', actor_id: '' }]
                        );
                    });

            });
    });

    it('GETS all films', () => {
        const saves = [titanic, juno].map( savedFilm => {
            return request.post('/api/films')
                .send(savedFilm)
                .then(res => res.body);
        });

        let saved = null;
        let savedData = null;

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

    it('updates a film', () => {
        const testFilm = {
            title: 'Free Willy',
            studio: 'Warner',
            released: 1993
        };

        let savedFilm = null;

        return request.post('/api/films')
            .send(titanic)
            .then(res => savedFilm = res.body)
            .then(() => {
                titanic.released = 2000;
                return request
                    .put(`/api/films/${savedFilm._id}`)
                    .send(titanic);
            })
            .then( res => {
                assert.deepEqual(res.body.nModified === 1, true);
            });
    });

    it('deletes film by ID', () => {
        let film = null;
        return request.post('/api/films')
            .send(titanic)
            .then(res => {
                film = res.body;
                return request.delete(`/api/films/${film._id}`);
            })
            .then( res => {
                assert.deepEqual(res.body, {removed: true});
                return request.get(`/api/films/${film._id}`);
            })
            .then(
                
                (data) => { console.log('%%%%%%%%%%%%%%%%%%%%%%', data.body);
                    throw new Error('Unexpected successful response');},
                err => {
                    assert.equal(err.status, 404);
                }
            );
    });
    
});
