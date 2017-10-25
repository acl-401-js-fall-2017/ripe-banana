const request = require('./request');
const mongoose = require('mongoose');
const assert = require('chai').assert;

describe('Film API', () => {

    let studio = {
        name: 'MGM'
    };

    let actor = {
        name: 'Ryan Gosling'
    };
    
    let movie1 = null;
    let movie2 = null;

    beforeEach(() => {

        mongoose.connection.dropDatabase();

        return request.post('/api/filmIndustry/studios')
            .send(studio)
            .then(res => res.body)
            .then(savedStudio => {
                studio = savedStudio;

            })
            .then(() => {
                return request.post('/api/filmIndustry/actors')
                    .send(actor)
                    .then(res => res.body)
                    .then(savedActor => {
                        actor = savedActor;

                        movie1 = {
                            title: 'Wonder Woman',
                            studio: studio._id,
                            released: 2017,
                            cast: {actor: actor._id}
                        };
                        

                        movie2 = {
                            title: 'Shawshank Redemption',
                            studio: studio._id,
                            released: 1995,
                            cast: [{actor: actor._id}]
                        };
                    });
            });
    });

    it('saves a film', () => {
        return request.post('/api/filmIndustry/films')
            .send(movie1)
            .then(({ body }) => {
                assert.equal(body.title, movie1.title);
            });
    });


    it('gets all films', () => {


        const filmArray = [movie1, movie2].map(movie => {
            return request.post('/api/filmIndustry/films')
                .send(movie)
                .then(res => res.body);
        });

        let saved = null;
        return Promise.all(filmArray)
            .then(_saved => {
                saved = _saved;
                return request.get('/api/filmIndustry/films');
            })
            .then(res => {
                assert.equal(res.body.title, saved.title);
                assert.equal(res.body.released, saved.released);
                assert.equal(res.body[0].studio.name, 'MGM');  
            });

    }),

    it('get a film by id', () => {
        let film = null;
        return request.post('/api/filmIndustry/films')
            .send(movie1)
            .then(res => {
                film = res.body;
                return request.get(`/api/filmIndustry/films/${film._id}`);
            })
            .then(res => {
                assert.equal(res.body.title, film.title);
                assert.equal(res.body.released, film.released);
                assert.equal(res.body.studio._id, film.studio);
                assert.equal(res.body.cast.part, film.cast.part);
                assert.ok(res.body.cast[0].actor.name);
            });
    }),

    it('deletes with id', () => {
        let savedFilm =null;
        return request.post('/api/filmIndustry/films')
            .send(movie1)
            .then(res => {
                savedFilm = res.body;
                return request.delete(`/api/filmIndustry/films/${savedFilm._id}`);
            })
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
            });
    });

    it('return false delete with bad id', () => {
        return request.delete('/api/filmIndustry/films/59dfeaeb083bf9beecc97ce8')
            .then(res => {
                assert.deepEqual(res.body, {removed: false});
            });
    });

    it('changes saved movie with id', () => {
        let update = { title: 'Rambo'};
        return request.post('/api/filmIndustry/films')
            .send(movie1)
            .then(res => {
                return request.put(`/api/filmIndustry/films/${res.body._id}`).send(update);
            })
            .then(res => {
                assert.equal(res.body.title, update.title);
            });
    });
});

