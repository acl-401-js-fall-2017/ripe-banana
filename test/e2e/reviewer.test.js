const { assert } = require('chai');
const mongoose = require('mongoose');
const request = require('./request');
const Reviewer = require('../../lib/models/reviewer');

describe('Reviewers API', () => {

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

    beforeEach(() => mongoose.connection.dropDatabase());
    
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

    beforeEach( () => {
        return request.post('/api/auth/signup')
            .send({name: 'Mr Smith', company: 'smithLLC', email:'smith', password:'smith'})
            .then( ()=> Reviewer.findOneAndUpdate({email:'user'}, {$push:{roles:'rookie'}}))
            .then( (updated) => {
                reviewerId = updated._id;
            });
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

    it('should return array of all reviewers, including name and company', () => {
        request.get('/api/reviewers')
            .then( ({body}) => {
                assert.equal( body.length, 2);
                assert.equal( body[1].name, 'Mr Smith');
            });
    });

    it('should get reviewer by id, returning name, company, and reviews [film.name, rating, review]', ()=> {
        return request.get(`/api/reviewers/${reviewerId}`)
            .then( ({body}) => {
                assert.equal(body.name, 'Mr Reviewer');
                assert.equal(body.reviews.length, 1);
                assert.equal(body.reviews[0].rating, review.rating);
                assert.equal(body.reviews[0].review, review.review);
            });
    });

    it('should update a reviewer by id', () => {    
        const update = {
            name: 'Schmuck',
            company: 'Hellcorp LLC'
        };

        return request.put(`/api/reviewers/${reviewerId}`)
            .set('Authorization', token)
            .send(update)
            .then( ({body}) => {
                assert.equal(body.name, update.name);
            });
    });

});