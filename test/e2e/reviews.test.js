const assert = require('chai').assert;
const mongoose = require('mongoose');
const request = require('./request');

describe('review API', () => {

    let testReview = null;

    beforeEach(() => {
        mongoose.connection.dropDatabase();

        const reviewer = {
            name: 'Kate Taylor',
            company: 'Globe and Mail'
        };

        return request.post('/api/reviewers')
            .send(reviewer)
            .then(res => {
                const testReviewer = res.body;
                testReview = {
                    rating: 5,
                    reviewer: testReviewer._id,
                    reviewText: 'this movie sucks'
                };
            });
    });

    it('saves a review with id', ()=>{
        return request.post('/api/reviews')
            .send(testReview)
            .then(res => {
                const review = res.body;
                assert.ok(review._id);
                assert.equal(review.reviewer, testReview.reviewer);
            });
    });

});