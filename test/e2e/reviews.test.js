const assert = require('chai').assert;
const mongoose = require('mongoose');
const request = require('./request');

describe('review API', () => {

    let testReview1 = null;
    let testReview2 = null;
    let testReview3 = null;
    let testReviewer = null;
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

   

    beforeEach(() => {

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
                    reviewText: 'this movie sucks',
                    film: film._id
                };
                testReview2 = {
                    rating: 2,
                    reviewer: testReviewer._id,
                    reviewText: 'this movie is poo',
                    film: film._id
                };
                testReview3 = {
                    rating: 5,
                    reviewer: testReviewer._id,
                    reviewText: 'this movie is great',
                    film: film._id
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
            reviewText: 'this movie sucks',
            film: film._id
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