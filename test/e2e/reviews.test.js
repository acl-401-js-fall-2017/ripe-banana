const { assert } = require('chai');
const mongoose = require('mongoose');
const request = require('./request');
const Reviewer = require('../../lib/models/reviewer');

describe('Reviews API', () => {
    beforeEach(() => {
        mongoose.connection.dropDatabase();
    });

    let reviewerId = '';
    let token='';

    beforeEach( () => {
        return request.post('/api/auth/signup')
            .send({name: 'Mr Reviewer', company: 'reviewLLC', email:'user', password:'abc'})
            .then( ()=> Reviewer.findOneAndUpdate({email:'user'}, {$push:{roles:'admin'}}))
            .then( (updated) => {
                reviewerId = updated._id;
                return request.post('/api/auth/signin')
                    .send({email:'user', password:'abc'});
            })
            .then( ({ body }) => token=body.token);
    });

    function saveStudio(studio){
        return request.post('/api/studios')
            .set('Authorization', token)
            .send(studio);
    }

    function saveActor(actor) {
        return request.post('/api/actors')
            .set('Authorization', token)
            .send(actor);
    }

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
            .set('Authorization', token)
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
            reviewer: reviewerId,
            review: 'Awsome movie',
            film: film._id
        };
        return request.post('/api/reviews/')
            .set('Authorization', token)
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
            reviewer: reviewerId,
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
            .set('Authorization', token)
            .send(reviewArray)
            .then( () => {
                return request.get('/api/reviews')
                    .then( ({body}) => {
                        assert.equal(body.length, 100);
                    });
            });
    });

    it('should update a review by id only if author of review is updating', ()=> {
        return request.put(`/api/reviews/${review._id}`)
            .set('Authorization', token)
            .send({review:'terrible'})
            .then( ({ body }) => assert.equal(body.review, 'terrible'));
    });

    it('should reject request to update a review by anyone other then original reviewer', ()=> {
        return request.post('/api/auth/signup')
            .send({name: 'Mr Smith', company: 'smithLLC', email:'smith', password:'smith'})
            .then( (moken)=> {
                return request.put(`/api/reviews/${review._id}`)
                    .set('Authorization', moken)
                    .send({review:'terrible'})
                    .then( 
                        () => {throw new Error('false negative');},
                        err => {assert.equal(err.status, 401);}
                    );
            });
    });
});