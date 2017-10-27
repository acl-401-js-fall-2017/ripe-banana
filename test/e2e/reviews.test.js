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

        const saveAllPromises = studioData.concat(actorData).map(dataObj => {
            return request
                .post(`/api/${dataObj.dob ? 'actors' : 'studios'}`)
                .send(dataObj);
        });
        
        return Promise.all(saveAllPromises)
            .then(res => {

                studios = res.slice(0, studioData.length).map(r => r.body);
                actors = res.slice( -actorData.length).map(r => r.body);

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

                const filmsReviewersSaved = filmData.concat(reviewerData).map(object => {
                    return request.post(`/api/${object.released ? 'films' : 'reviewers'}`)
                        .send(object);
                });

                return Promise.all(filmsReviewersSaved)
                    .then(frRes => {
                        films = frRes.slice(0, filmData.length).map(r => r.body);
                        reviewers = frRes.slice(-reviewerData.length).map(r => r.body);
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