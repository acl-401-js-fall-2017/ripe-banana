const assert = require('chai').assert;
const Review = require('../../lib/models/review');
const Reviewer = require('../../lib/models/reviewer');
const request = require('../e2e/request');
const mongoose = require('mongoose');

describe('review model', () => {

    let studio = null;
    let film = null;
    const searchLight = {
        name: 'Searchlight'
    };

    beforeEach(()=> {
        mongoose.connection.dropDatabase();
        return request.post('/api/studios')
            .send(searchLight)
            .then(res => studio = res.body);
    });


    beforeEach(()=>{
        film = {
            title: 'Dumb and Dumberer',
            studio: studio._id,
            released: 1998,
        };
        return request.post('/api/films')
            .send(film)
            .then(res => film = res.body);
    }); 

    const testReviewer = new Reviewer({
        name: 'Kate Taylor',
        company: 'Globe and Mail'
    });

    it('Validates a good model ', () => {
        const review = new Review({
            rating: 5,
            reviewer: testReviewer._id,
            reviewText: 'this movie sucks',
            film: film._id
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