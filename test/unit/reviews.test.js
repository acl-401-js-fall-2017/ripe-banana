const { assert } = require('chai');
const Review = require('../../lib/models/review');


describe('Review test', () => {
    
    const review = new Review({
        rating: 5,

        reviewer: '59ef87b38e62d836e1c0ee48',

        review: 'this gets my personal Big Thumbs Up',

        film: '59ef87b38e62d836e1c0ee41'

    });

    it('should validate a good model', () => {

        const validate = review.validateSync();

        assert.equal(validate, undefined);

    });

    it('should return error if no rating provided', () => {
        let badReview = new Review({});

        const { errors } = badReview.validateSync();
        assert.equal(errors.rating.kind, 'required');
    });

    it('should return error if invalid rating', () => {
        let badReview = new Review({
            rating: 10
        });

        const { errors } = badReview.validateSync();
        assert.equal(errors.rating.kind, 'max');
    });

    it('should return error if invalid reviewer ID', () => {
        let badReview = new Review({
            reviewer: 'hello'
        });

        const { errors } = badReview.validateSync();
        assert.equal(errors.reviewer.kind, 'ObjectID');
    });

    it('should return error if invalid reviewer ID', () => {
        let badReview = new Review({
            film: 'I CANT READ'
        });

        const { errors } = badReview.validateSync();
        assert.equal(errors.film.kind, 'ObjectID');
    });


});