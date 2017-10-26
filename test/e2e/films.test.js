const assert = require('chai').assert;
const mongoose = require('mongoose');
const request = require('./request');

describe('films API', () => {

    let studio = {
        name: 'Warner',
        address: {
            city: 'Hollywood',
            state: 'CA'
        }
    };

    let leonardoDiCaprio = {
        name: 'Leonardo DiCaprio'
    };

    let kateWinslet = {
        name: 'Kate Winslet'
    };

    let actors = [leonardoDiCaprio, kateWinslet];

    let titanic = null;
    let juno = null;
    let actorsWithID = null;

    beforeEach(() => {
        mongoose.connection.dropDatabase();

        return request.post('/api/studios')
            .send(studio)
            .then(res => res.body)
            .then(saved => {
                studio = saved;
            })
            .then(() => {
                const savedActors = actors.map(actor => {
                    return request.post('/api/actors')
                        .send(actor)
                        .then(res => res.body);
                });
                return Promise.all(savedActors)
                    .then(saves => {
                        saves = saves.sort((a, b) => a._id < b._id);
                        return saves;
                    })
                    .then((actorSaved) => {
                        actorsWithID = actorSaved;
                        titanic = {
                            title: 'Titanic',
                            studio: studio._id,
                            released: 1998,
                            cast: [
                                {
                                    part: 'Rose DeWitt Bukater',
                                    actor: actorsWithID[0]._id
                                },
                                {
                                    part: 'Jack Dawson',
                                    actor: actorsWithID[1]._id
                                }
                            ]
                        };
                        juno = {
                            title: 'juno',
                            studio: studio._id,
                            released: 2002
                        };
                    });
            });
    });





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
                        assert.ok(film.cast);
                        assert.deepEqual(film.cast[0].actor.name, 'Kate Winslet');
                        assert.deepEqual(film.cast[1].actor.name, 'Leonardo DiCaprio');
                    });

            });
    });

    it('GETS all films', () => {
        const saves = [titanic, juno].map(savedFilm => {
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
                let sortedSavedData = savedData.sort((a, b) => a._id < b._id);
                assert.deepEqual(res.body, sortedSavedData);
            });
    });

    it('updates a film', () => {

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
            .then(res => {
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
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
                return request.get(`/api/films/${film._id}`);
            })
            .then(
                () => {
                    throw new Error('Unexpected successful response');
                },
                err => {
                    assert.equal(err.status, 404);
                }
            );
    });
});
