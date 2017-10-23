const assert = require('chai').assert;
const mongoose = require('mongoose');
const request = require('./request');


describe('reviewer API', () => {
    beforeEach(() => mongoose.connection.dropDatabase());

    const kateTaylor = {
        name: 'Kate Taylor',
        company: 'Globe and Mail'
    };

    const jamesBerardinelli = {
        name: 'James Berardinelli',
        company: 'ReelViews'
    };

    it('saves a reviewer with id', () => {
        return request.post('/api/reviewers')
            .send(kateTaylor)
            .then(res => {
                const reviewer = res.body;
                assert.ok(reviewer._id);
                assert.equal(reviewer.name, kateTaylor.name);
            });
    });

    it('Gets all reviewers', () => {
        const saves = [jamesBerardinelli, kateTaylor].map(reviewer => {
            return request.post('/api/reviewers')
                .send(reviewer)
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
                        name: save.name
                    };
                });
                return request.get('/api/reviewers');
            })
            .then(res => {
                let sortedSavedData = savedData.sort((a,b) => a._id < b._id);
                assert.deepEqual(res.body, sortedSavedData);
            });
    });

    it('Shoud get a reviewer by id', () => {
        let reviewer;
        let id;
        let testReview1 = null;
        let testReview2 = null;
        let testReview3 = null;


        return request.post('/api/reviewers')
            .send(kateTaylor)
            .then(res => {
                reviewer = res.body;
                testReview1 = {
                    rating: 1,
                    reviewer: reviewer._id,
                    reviewText: 'this movie sucks'
                };
                testReview2 = {
                    rating: 2,
                    reviewer: reviewer._id,
                    reviewText: 'this movie is poo'
                };
                testReview3 = {
                    rating: 5,
                    reviewer: reviewer._id,
                    reviewText: 'this movie is great'
                };

                id = reviewer._id;
                let theReviews = [testReview1, testReview2, testReview3].map(review =>{ 
                    return request.post('/api/reviews')
                        .send(review)
                        .then(res =>  res.body);
                });
                return Promise.all(theReviews)
                    .then((response) => {
                        return request.get(`/api/reviewers/${id}`)
                            .then(res => {
                                let sortedReviews = response.sort((a,b) => a.createdAt < b.createdAt);
                                let checkObject = { _id: id, name: reviewer.name, reviews: sortedReviews };
                                assert.deepEqual(res.body, checkObject);
                            });

                    });
            });

    });


});

