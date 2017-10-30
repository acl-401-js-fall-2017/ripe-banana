
const {assert} = require('chai');
const Review = require('../../lib/models/Review');

describe('Review Model', () => {

    let randomID = null;
    let rawData = null;

    before(() => {
        randomID = '59ed81a77d24225ec86bec2c';     
    });

    beforeEach(() => {
        rawData = {
            rating: 5,
            reviewer: randomID,
            review: 'below 140 we should be fine',
            film: randomID,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    });

    it('Vaild model', () => {
        const review = new Review(rawData);

        assert.ok(review.rating);
        assert.ok(!review.validateSync());
    });

    it('test for valid ranges', () => {
        rawData.rating = 6;
        rawData.review = `it('constructs a valid film with a new mongo id', () => {
            const newMov = new Film(rawData);
            assert.ok(newMov._id);
            assert.ok(!newMov.validateSync());`;

        const review = new Review(rawData);

        assert.ok(review.validateSync());
        assert.equal(review.validateSync().errors.rating.kind, 'max');
        assert.equal(review.validateSync().errors.review.kind, 'maxlength');
    });

    it('required fields', () => {
        const review = new Review({});
        
        const errors = review.validateSync().errors;
        assert.equal(errors.rating.kind, 'required');
        assert.equal(errors.reviewer.kind, 'required');
        assert.equal(errors.review.kind, 'required');
        assert.equal(errors.film.kind, 'required');
    });
});