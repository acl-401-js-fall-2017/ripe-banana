const {assert} = require('chai');
const mongoose = require('mongoose').connection;
const request = require('./request');

describe('studio CRUD', () => {

    let rawData = [
        {
            name: 'Touchstone Studio',
            address: {
                city: 'Portland',
                state: 'New Zealand',
                country: 'Mars'
            }
        },
        {
            name: 'Time Warner',
            address: {
                city: 'Burbank',
                state: 'Cali',
                country: 'USA! USA!'
            }
        },      
        {
            name: 'Paramount',
            address: {
                city: 'paris',
                state: 'Paris',
                country: 'PARIS'
            }
        }
    ];
    let ts = null,
        tw = null,
        pm = null;
    beforeEach(() => {
        mongoose.dropDatabase();

        ts = rawData[0];
        tw = rawData[1];
        pm = rawData[2];
    });

    describe('get', () => {
        it('retrieves all items in the database', () => {

            const saveStudios = [
                request.post('/api/studios').send(ts),
                request.post('/api/studios').send(tw),
                request.post('/api/studios').send(pm)
            ];
            return Promise.all(saveStudios)
                .then(saved => {
                    saved = saved.map(item => {
                        return {
                            name: item.body.name,
                            _id: item.body._id
                        };
                    });
                    return request.get('/api/studios')
                        .then(res => {
                            assert.deepInclude(res.body, saved[0]);
                            assert.deepInclude(res.body, saved[1]);
                            assert.deepInclude(res.body, saved[2]);
                        });
                });
        });

        it('retrieves an item by its id (with films)', () => {
            return request.post('/api/studios')
                .send(rawData[0])
                .then(({body: saved}) => {

                    const randomID = '59ed81a77d24225ec86bec2c';
                    const filmData = [
                        {
                            title: 'Halloween',
                            studio: saved._id,
                            released: 2000,
                            cast: [
                                {
                                    part: 'damsel in distress',
                                    actor: randomID
                                },
                                {
                                    part: 'lead',
                                    actor: randomID
                                }
                            ]
                        },
                        {
                            title: 'Blade Runner',
                            studio: saved._id,
                            released: 2017,
                            cast: [
                                {
                                    part: 'android',
                                    actor: randomID
                                },
                                {
                                    part: 'human',
                                    actor: randomID
                                }
                            ]
                        }
                    ];
                    const saveFilms = [
                        request.post('/api/films').send(filmData[0]),
                        request.post('/api/films').send(filmData[1])
                    ];

                    return Promise.all(saveFilms)
                        .then(savedFilms => {
                            const films = savedFilms.map(res => res.body.title);
                            saved.films = films;
        
                            return request.get(`/api/studios/${saved._id}`)
                                .then(gotten => {
                                    assert.deepEqual(gotten.body, saved);
                                });
                        });
                });
        });
    }) ;

    describe('post', () => {
        it('returns the saved object with _id', () => {
            return request.post('/api/studios')
                .send(tw)
                .then(res => {
                    tw._id = res._id;
                    assert.ok(res.body._id);
                });
        });
    });

    describe('delete', () => {
        it('deletes the saved object with _id', () => {
            return request.post('/api/studios')
                .send(tw)
                .then(res => {
                    return request.del(`/api/studios/${res.body._id}`)
                        .then(deleted => {
                            assert.deepEqual(deleted.body, {removed: true});
                        });
                });
        });
    });
});