const {assert} = require('chai');
const mongoose = require('mongoose').connection;
const request = require('./request');

describe('Reviews CRUD', () => {
    let studios = null;
    let actors = null;
    let filmData = null;
    let reviewerData = null;
    let films = null;
    let reviewers = null;
    let reviewData = null;

    beforeEach(() => {
        mongoose.dropDatabase();

        const studioData = [
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
        const actorData = [
            {
                name: 'Steven',
                dob: new Date('2017-10-20'),
                pob: '30th NW 10th Ave, Portland, Oregon 97209'

            },
            {
                name: 'Oprah',
                dob: new Date('1954-1-29'),
                pob: 'Kosciusco, MS'
            },
            {
                name: 'Tom Cruise',
                dob: new Date('1000-0-0'),
                pob: 'Kolob'
            }
        ];

        const save = resource => data => request.post(`/api/${resource}`).send(data).then(res => res.body);

        const saveStudios = Promise.all(studioData.map(save('studios')));
        const saveActors = Promise.all(actorData.map(save('actors')));
        
        return Promise.all([saveActors, saveStudios])
            .then(([actorsRes, studiosRes]) => {

                studios = studiosRes;
                actors = actorsRes;

                filmData = [
                    {
                        title: 'Halloween',
                        studio: studios[0]._id,
                        released: 2000,
                        cast: [
                            {
                                part: 'damsel in distress',
                                actor: actors[0]._id
                            },
                            {
                                part: 'lead',
                                actor: actors[1]._id
                            }
                        ]
                    },
                    {
                        title: 'Blade Runner',
                        studio: studios[1]._id,
                        released: 2017,
                        cast: [
                            {
                                part: 'android',
                                actor: actors[2]._id
                            },
                            {
                                part: 'human',
                                actor: actors[1]._id
                            }
                        ]
                    }
                ];

                reviewerData = [
                    {
                        name: 'mel',
                        company: 'film blog of mel'
                    },
                    {
                        name: 'gibson',
                        company: 'film blog of gibson'
                    }
                ];
                
                const save = pathEnd => data => request.post(`/api/${pathEnd}`).send(data).then(res => res.body);

                const saveFilms = Promise.all(filmData.map(save('films')));
                const saveReviewers = Promise.all(reviewerData.map(save('reviewers')));

                return Promise.all([saveFilms, saveReviewers])
                    .then(frRes => {
                        films = frRes[0];
                        reviewers = frRes[1];
                        reviewData = [
                            {
                                rating: 3,
                                reviewer: reviewers[0]._id,
                                review: 'dlfjdskfjlsdfjsdlkfjdsjfjsldfjdslkfjdsjflsdjfsdjffdlksfjsklf',
                                film: films[1]._id
                            },
                            {
                                rating: 5,
                                reviewer: reviewers[1]._id,
                                review: 'dlfdjsflds3343343434343434343434xcxccxcxxcxcc',
                                film: films[0]._id
                            }
                        ];
                    });
            });
    });

    describe('Reviews POST', () => {
        it('Post a review and return with id', () => {
            return request.post('/api/reviews')
                .send(reviewData[1])
                .then(({body: revRes}) => {
                    assert.ok(revRes._id);
                });
        });
    });
    describe('Reviews GET', () => {
        it('Gets all(max 100) reviews with rating, review, and film name', () => {
            const saveReviews = [
                request.post('/api/reviews').send(reviewData[0]),
                request.post('/api/reviews').send(reviewData[1])
            ];
            return Promise.all(saveReviews)
                .then(revResArr => {
                    let revArr = revResArr.map((r) => r.body);
                    revArr = revArr.map(r => {
                        const leanReview = {
                            _id: r._id,
                            review: r.review,
                            rating: r.rating,
                            film: null
                        };
                        films.forEach(f => {
                            if(f._id === r.film) leanReview.film = f.title;
                        });
                        return leanReview;
                    });
                    return request.get('/api/reviews')
                        .then(({body: getArr}) => {
                            revArr.forEach(r => assert.deepInclude(getArr, r));
                        });
                });
        });
    });
    describe('Reviews PATCH', () => {
        it('Patch a review and returns it', () => {
            return request.post('/api/reviews')
                .send(reviewData[0])
                .then(({body: revRes}) => {
                    assert.ok(revRes._id);
                    revRes.rating = 2;
                    return request.patch(`/api/reviews/${revRes._id}`)
                        .send({rating: 2})
                        .then(({body: updateRes}) => {
                            assert.deepEqual(revRes, updateRes);
                        });
                });
            
        });
    });
});