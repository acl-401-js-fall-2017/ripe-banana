const assert = require('chai').assert;
const Review = require('../../lib/models/review');

describe('Review model', () => {

    it('check if good model', () => {
        const review = new Review({
            rating: 3,
            reviewer: '59eb8057ea2b371badf14536',
            review_text: 'Great movie!!', 
            film: '59eb8057ea2b371badf14534'
        });
        assert.equal(review.validateSync(), undefined);
    });

    it('checks required fields', () => {
        const review= new Review ({ });
        const { errors } = review.validateSync();
        assert.equal(errors.rating.kind, 'required');
    });
});