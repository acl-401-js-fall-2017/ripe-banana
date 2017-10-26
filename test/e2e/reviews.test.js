const { assert } = require('chai');
const mongoose = require('mongoose');
const request = require('./request');

describe('Reviews API', () => {

    const reviewerOne = {
        name: 'John Doe',
        company: 'Enron'
    };

    function saveStudio(studio){
        return request.post('/api/studios')
            .send(studio);
    }

    function saveActor(actor) {
        return request.post('/api/actors')
            .send(actor);
    }

    beforeEach(() => {
        mongoose.connection.dropDatabase();
    });

    let reviewer = null;
    beforeEach ( () => {
        return request.post('/api/reviewers')
            .send(reviewerOne)
            .then(({ body }) => reviewer = body);
    });

    let actor = null;
    beforeEach( () => {
        return saveActor ( { name: 'Mel Gibson', pob:'My Basement'})
            .then( ({body}) => actor = body);
    });

    let studio = null;
    beforeEach( () => {
        return saveStudio( { name: 'Universal'})
            .then( ({body}) => studio = body);
    });

    let film = null;
    beforeEach( () => {
        return request.post('/api/films')
            .send({
                title: 'The Room',
                studio: studio._id,
                released: 2000,
                cast: {
                    actor: actor._id 
                }
            })
            .then (({body}) =>{
                film = body ;
            });

    });

    let review = null;
    beforeEach( () => {
        review = {
            rating: 4,
            reviewer: reviewer._id,
            review: 'Awsome movie',
            film: film._id
        };
        return request.post('/api/reviews/')
            .send(review)
            .then (saved =>{
                review = saved.body;
            });
    });

    it('should post and get a review', () => {
        return request.get(`/api/reviews/${review._id}`)
            .then( ({body}) => {
                assert.equal( body.rating, review.rating );
            });
    });

    it('should get array of all reviews, including rating, review, and film name. limit to 100', () => {
        let test = { rating: 4,
            reviewer: reviewer._id,
            review: 'Awsome movie',
            film: film._id,
            createdAt: new Date()
        };

        function makeReview(){
            test.review += '!';
            return test;
        }

        let reviewArray = Array(100).fill().map(makeReview);
        return request.post('/api/reviews')
            .send(reviewArray)
            .then( () => {
                return request.get('/api/reviews')
                    .then( ({body}) => {
                        assert.equal(body.length, 100);
                    });
            });
    });

    it('should update a review by id', ()=> {
        return request.put(`/api/reviews/${review._id}`)
            .send({review:'terrible'})
            .then( ({ body }) => assert.equal(body.review, 'terrible'));
    });

});
