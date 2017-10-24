const assert = require('chai').assert;
const mongoose = require('mongoose');
const request = require('./request');

describe('review API', () => {

    let testReview1 = null;
    let testReview2 = null;
    let testReview3 = null;
    let testReviewer = null;

    beforeEach(() => {
        mongoose.connection.dropDatabase();

        const reviewer = {
            name: 'Kate Taylor',
            company: 'Globe and Mail'
        };

        return request.post('/api/reviewers')
            .send(reviewer)
            .then(res => {
                testReviewer = res.body;
                testReview1 = {
                    rating: 1,
                    reviewer: testReviewer._id,
                    reviewText: 'this movie sucks'
                };
                testReview2 = {
                    rating: 2,
                    reviewer: testReviewer._id,
                    reviewText: 'this movie is poo'
                };
                testReview3 = {
                    rating: 5,
                    reviewer: testReviewer._id,
                    reviewText: 'this movie is great'
                };
            });
    });

    it('saves a review with id', ()=>{
        return request.post('/api/reviews')
            .send(testReview1)
            .then(res => {
                const review = res.body;
                assert.ok(review._id);
                assert.equal(review.reviewer, testReview1.reviewer);
            });
    });

    it('Gets all reviews', () =>{
        const saves = [testReview1, testReview2, testReview3].map(review =>{
            return request.post('/api/reviews')
                .send(review)
                .then(res => res.body);
        });
        let saved = null;
        let savedData = null;
        return Promise.all(saves)
            .then(_saved => {
                saved = _saved;
                savedData = saved.map( save => {
                    return {
                        _id: save._id,
                        rating: save.rating,
                        reviewText: save.reviewText
                    };
                }).sort((a,b) => a._id < b._id);
                return request.get('/api/reviews');
            })
            .then(res =>{
                assert.deepEqual(res.body, savedData);
            });
    });

    it('updates a review', () => {
        const badReview = {
            rating: 1,
            reviewer: testReviewer._id,
            reviewText: 'this movie sucks'
        };

        let savedReview = null;

        return request.post('/api/reviews')
            .send(badReview)
            .then(res => savedReview = res.body)
            .then(() => {
                badReview.rating = 5;
                return request
                    .put(`/api/reviews/${savedReview._id}`)
                    .send( badReview );
            })
            .then( res => {
                assert.deepEqual(res.body.nModified === 1, true);
            });

    });

});