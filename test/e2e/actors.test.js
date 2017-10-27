const {assert} = require('chai');
const mongoose = require('mongoose').connection;
const request = require('./request');

describe.only('actor CRUD', () => {
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

    describe('POST Actor', () => {
        it('returns actor with new id', () => {
            return request.post('/api/actors')
                .set({Authorization: superToken})
                .send(rawData[0])
                .then(res => assert.ok(res.body._id));
        });
    });

    describe('GET Actor', () => {
        it('returns all when no id', () => {
            const saveAll = [
                request.post('/api/actors')
                    .set({Authorization: superToken})
                    .send(rawData[0]),
                request.post('/api/actors')
                    .set({Authorization: superToken})
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
                .set({Authorization: superToken})
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
                    ];
                    const saveFilms = [
                        request.post('/api/films').set({Authorization: superToken}).send(filmData[0]),
                        request.post('/api/films').set({Authorization: superToken}).send(filmData[1])
                    ];
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
                .set({Authorization: superToken})
                .send(rawData[1])
                .then(res => {
                    return request.del(`/api/actors/${res.body._id}`)
                        .set({Authorization: superToken})                    
                        .then(({body: status}) => assert.deepEqual(status, {removed: true}));
                });
        });
    });

    describe('Actors PATCH', () => {
        it('Patch an actor and returns it', () => {
            return request.post('/api/actors')
                .set({Authorization: superToken})
                .send(rawData[0])
                .then(({body: actorRes}) => {
                    assert.ok(actorRes._id);
                    actorRes.pob = 'NW 8th Ave, Portland, Oregon 97209';
                    return request.patch(`/api/actors/${actorRes._id}`)
                        .set({Authorization: superToken})
                        .send({pob: 'NW 8th Ave, Portland, Oregon 97209'})
                        .then(({body: updateActor}) => {
                            assert.deepEqual(actorRes, updateActor);
                        });
                });
        });
    });
});