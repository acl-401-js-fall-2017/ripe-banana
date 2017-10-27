const {assert} = require('chai');
const mongoose = require('mongoose').connection;
const request = require('./request');

describe('Reviewer CRUD', () => {
    let rawData = null;
    
    let superToken = null;
    beforeEach(async () => {
        ({body: superToken} = await request.post('/api/auth/signup')
            .send({
                name: 'Magnus ver Magnusson',
                roles: 'admin',
                company: 'The Shadow Government',
                email: 'Magnusson@Magnus.org',
                password: '^%fyf^5f&tf&f6DR&fRF^%3S5ruJ0iN9J)OmU*hiM9VrC54@AA$zD'
            }));
    });
    
    beforeEach(() => {
        mongoose.dropDatabase();
        rawData = [
            {
                name: 'mel',
                company: 'film blog of mel'
            },
            {
                name: 'gibson',
                company: 'film blog of gibson'
            }
        ];
    });

    describe('POST Reviewer', () => {
        it('returns reviewer with new id', () => {
            return request.post('/api/reviewers')
                .send(rawData[0])
                .set({Authorization: superToken})
                .then( res => {
                    assert.ok(res.body._id);
                });
        });
    });
    describe('GET Reviewer', () => {
        it('returns all with no given id', () => {
            const saveAll = [
                request.post('/api/reviewers')
                    .set({Authorization: superToken})
                    .send(rawData[0]),
                request.post('/api/reviewers')
                    .set({Authorization: superToken})
                    .send(rawData[1])
            ];

            return Promise.all(saveAll)
                .then(resArray => {
                    resArray = resArray.map(res => {
                        return {
                            name: res.body.name,
                            _id: res.body._id
                        };
                    });
                    return request.get('/api/reviewers')
                        .then(gotten => {
                            assert.deepInclude(gotten.body, resArray[0]);
                            assert.deepInclude(gotten.body, resArray[1]);
                        });
                });
        });
        it('returns reviewer by id', () => {
            return request.post('/api/reviewers')
                .set({Authorization: superToken})
                .send(rawData[0])
                .then(res => {
                    const saved = res.body;
                    delete saved.__v;
                    const tokenId = '59ed81a77d24225ec86bec2c';
                    const filmData = [
                        {
                            title: 'Halloween',
                            studio: tokenId,
                            released: 2000,
                            cast: [
                                {
                                    part: 'damsel in distress',
                                    actor:tokenId
                                },
                                {
                                    part: 'lead',
                                    actor:tokenId
                                }
                            ]
                        },
                        {
                            title: 'Blade Runner',
                            studio: tokenId,
                            released: 2017,
                            cast: [
                                {
                                    part: 'android',
                                    actor:tokenId
                                },
                                {
                                    part: 'human',
                                    actor:tokenId
                                }
                            ]
                        }
                    ];
                    const savedFilms = [
                        request.post('/api/films')
                            .set({Authorization: superToken})
                            .send(filmData[0]),
                        request.post('/api/films')
                            .set({Authorization: superToken})
                            .send(filmData[1])
                    ];

                    return Promise.all(savedFilms)
                        .then(filmRes => {
                            const films = filmRes.map(r => r.body);

                            const reviewData = [
                                {
                                    rating: 4,
                                    reviewer: saved._id,
                                    review: 'fbdlfkdsjfsdfkcmncmxncmxnmcnmxcnc',
                                    film: films[0]._id
                                },
                                {
                                    rating: 2,
                                    reviewer: saved._id,
                                    review: 'fasasasasasaasaasasasasasassa',
                                    film: films[1]._id
                                }
                            ];

                            return Promise.all(reviewData.map(r => request.post('/api/reviews').send(r)))
                                .then(() => {
                                    saved.reviews = [
                                        {
                                            rating: 4,
                                            review: 'fbdlfkdsjfsdfkcmncmxncmxnmcnmxcnc',
                                            film: films[0].title
                                        },
                                        {
                                            rating: 2,
                                            review: 'fasasasasasaasaasasasasasassa',
                                            film: films[1].title
                                        }
                                    ];

                                    return request.get(`/api/reviewers/${saved._id}`)
                                        .then(getRes => assert.deepEqual(getRes.body, saved));     
                                });
                        });
                        
                });
        });
    });
    describe('DELETE Reviewer', () => {
        it('given a valid id returns true', () => {
            return request.post('/api/reviewers')
                .set({Authorization: superToken})
                .send(rawData[0])
                .then( res => {
                    return request.del(`/api/reviewers/${res.body._id}`)
                        .set({Authorization: superToken})
                        .then(({body: status}) => {
                            assert.deepEqual(status, {removed: true});
                        });
                });
        });
    });

    describe('PATCH', () => {
        it('replaces part of a reviewer document', () => {
            return request.post('/api/reviewers')
                .set({Authorization: superToken})
                .send(rawData[1])
                .then(({body: saved}) => {
                    saved.company = 'company';
                    return request.patch(`/api/reviewers/${saved._id}`)
                        .set({Authorization: superToken})
                        .send({company: 'company'})
                        .then(({body: updated}) => {
                            assert.deepEqual(saved, updated);
                        });
                });
        });
    });
});