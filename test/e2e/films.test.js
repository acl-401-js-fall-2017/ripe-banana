const request = require('./request');
const mongoose = require('mongoose');
const assert = require('chai').assert;

describe('Film API', () => {

    let studio = {
        name: 'MGM'
    };
    
    let movie1 = null;
    let movie2 = null;

    beforeEach(() => {
        
        mongoose.connection.dropDatabase();

        return request.post('/api/filmIndustry/studios')
            .send(studio)
            .then(res => res.body)
            .then(saved => {
                studio = saved;

                movie1 = {
                    title: 'Wonder Woman',
                    studio: studio._id,
                    released: 2017
                };

                movie2 = {
                    title: 'Shawshank Redemption',
                    studio: studio._id,
                    released: 1995
                };
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
                assert.deepEqual(res.body, saved);
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
                assert.deepEqual(res.body, film);
            });
    });
});

