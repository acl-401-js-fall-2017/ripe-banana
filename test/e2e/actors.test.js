const {assert} = require('chai');
const mongoose = require('mongoose').connection;
const request = require('./request');

describe('actor CRUD', () => {
    let rawData = null;

    beforeEach(() => {
        mongoose.dropDatabase();
        rawData = [
            {
                name: 'Steven',
                dob: new Date('2017-10-20'),
                pob: '30th NW 10th Ave, Portland, Oregon 97209'

            },
            {
                name: 'Oprah'
            }
        ];
    });

    describe('POST Actor', () => {
        it('returns actor with new id', () => {
            return request.post('/api/actors')
                .send(rawData[0])
                .then(res => assert.ok(res.body._id));
        });
    });

    describe('GET Actor', () => {
        it('returns all when no id', () => {
            const saveAll = [
                request.post('/api/actors')
                    .send(rawData[0]),
                request.post('/api/actors')
                    .send(rawData[1])
            ];

            return Promise.all(saveAll)                
                .then(resArray => {
                    resArray = resArray.map((res) => {
                        return {
                            name: res.body.name,
                            _id: res.body._id
                        };
                    });
                    return request.get('/api/actors')
                        .then(gotten => {
                            assert.deepInclude(gotten.body, resArray[0]);
                            assert.deepInclude(gotten.body, resArray[1]);
                        });
                });
                
        });
        it('get actor by id', () => {
            return request.post('/api/actors')
                .send(rawData[1])
                .then(({body: saved}) => {

                    delete saved.__v;
                    const tokenID = '59eda47c92868f6ce8df7b23';
                    const filmData = [
                        {
                            title: 'Halloween',
                            studio: tokenID,
                            released: 2000,
                            cast: [
                                {
                                    part: 'damsel in distress',
                                    actor: saved._id
                                },
                                {
                                    part: 'lead',
                                    actor: tokenID
                                }
                            ]
                        },
                        {
                            title: 'Blade Runner',
                            studio: tokenID,
                            released: 2017,
                            cast: [
                                {
                                    part: 'android',
                                    actor: tokenID
                                },
                                {
                                    part: 'human',
                                    actor: saved._id
                                }
                            ]
                        }
                    ]
                    const saveFilms = [
                        request.post('/api/films').send(filmData[0]),
                        request.post('/api/films').send(filmData[1])
                    ]
                    return Promise.all(saveFilms)
                        .then(filmRes => {

                            saved.films = filmRes.map(film => ({title: film.body.title, released: film.body.released}));
                            return request.get(`/api/actors/${saved._id}`)
                                .then(getRes => {
                                    assert.deepEqual(getRes.body, saved);
                                });
                        });
                });
        });

    });
    
    describe('DELETE Actor', () => {
        it('given a valid id returns removed true', () => {
            return request.post('/api/actors')
                .send(rawData[1])
                .then(res => {
                    return request.del(`/api/actors/${res.body._id}`)
                        .then(({body: status}) => assert.deepEqual(status, {removed: true}));
                });
        });
    });
});