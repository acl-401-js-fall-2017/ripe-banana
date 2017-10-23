const assert = require('chai').assert;
const Review = require('../../lib/models/review');
const Reviewer = require('../../lib/models/reviewer');

describe('review model', () => {

    const testReviewer = new Reviewer({
        name: 'Kate Taylor',
        company: 'Globe and Mail'
    });
    console.log('I AM THE TEST REVIEWER =============', testReviewer)

    it('Validates a good model ', () => {
        const review = new Review({
            rating: 5,
            reviewer: testReviewer._id,
            reviewText: 'this movie sucks'
        });
        assert.equal(review.validateSync(), undefined);
    });

    it('checks for required fields', ()=> {
        const review = new Review({});
        const { errors } = review.validateSync(); 
        assert.equal(errors.rating.kind, 'required');
        assert.equal(errors.reviewText.kind, 'required');
    });

});