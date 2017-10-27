const  {assert} = require('chai');
const mongoose = require('mongoose');
const request = require('./request');
const Reviewer = require('../../lib/models/reviewer');

describe('Film API', () => {

    beforeEach( () => mongoose.connection.dropDatabase());

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
    let actor2 = null;

    beforeEach( () => {
        return saveActor ( { name: 'Mel Gibson', pob:'My Basement'})
            .then( ({body}) => actor = body);
    });

    beforeEach( () => {
        return saveActor ( { name: 'Mel Shrikson', pob:'My Basement'})
            .then( ({body}) => actor2 = body);
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
  
    it('saved film', () => {
        assert.equal(film.title, 'The Room');
        assert.equal(film.cast[0].actor, actor._id);
        assert.equal(film.studio, studio._id);
    });
    
    it('gets film by id', () => {
        return request.get(`/api/films/${film._id}`)
            .set('Authorization', token)
            .then( got => {
                assert.equal(got.body.title, film.title);
                assert.equal(got.body.cast[0].actor.name, actor.name);
                assert.equal(got.body.studio.name, studio.name);
                assert.equal(got.body.review[0].review, review.review);
            });
    });

    it('should return an array of all films including title, studio name, and release year', () => {
        return request.post('/api/films')
            .set('Authorization', token)
            .send({
                title: 'Shrek 4',
                studio: studio._id,
                released: 2000,
                cast: {
                    actor: actor._id 
                }
            })
            .then( () => request.get('/api/films'))
            .then( got => {
                assert.equal(got.body.length, 2);
                assert.ok(got.body.find(a => a.title === 'Shrek 4'));
                assert.ok(got.body.find(a => a.title === 'The Room'));
            });
    });

    it('should update film by id', ()=> {
        const update ={
            title: 'Shrek 5',
            cast: { actor: actor2._id }
        };

        return request.put(`/api/films/${film._id}`)
            .set('Authorization', token)
            .send(update)
            .then( updated => {
                assert.equal(updated.body.title, update.title );
                assert.equal(updated.body.cast.actor.name, actor2.name);
            });
    });

    it(' Should delete by id', () => {
        return request.delete(`/api/films/${film._id}`)
            .set('Authorization', token)
            .then(deleted => {
                assert.equal(deleted.body.title, film.title);
            });
    });

});