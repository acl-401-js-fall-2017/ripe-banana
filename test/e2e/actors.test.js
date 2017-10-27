const  {assert} = require('chai');
const mongoose = require('mongoose');
const request = require('./request');
const Reviewer = require('../../lib/models/reviewer');

describe('Actor API', () => {
    
    beforeEach( () => mongoose.connection.dropDatabase());

    let token='';
    beforeEach( () => {
        return request.post('/api/auth/signup')
            .send({name: 'Mr Reviewer', company: 'reviewLLC', email:'user', password:'abc'})
            .then( ()=> Reviewer.findOneAndUpdate({email:'user'}, {$push:{roles:'admin'}}))
            .then( () => {
                return request.post('/api/auth/signin')
                    .send({email:'user', password:'abc'});
            })
            .then( ({ body }) => token=body.token);
    });

    const actor = {
        name: 'Mel Gibson'
    };
    function saveStudio(studio){
        return request.post('/api/studios')
            .set('Authorization', token)
            .send(studio);
    }

    let studio = null;
    beforeEach( () => {
        return saveStudio( { name: 'Universal'})
            .then( ({body}) => studio = body);
    });

    let actorTest = null;
    function saveActor(actor) {
        return request.post('/api/actors')
            .set('Authorization', token)
            .send(actor);
    }

    beforeEach( () => {
        return saveActor ( { name: 'Mel Gibson', pob:'My Basement'})
            .then( ({body}) => actorTest = body);
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
                    actor: actorTest._id 
                }
            })
            .then (({body}) =>{
                film = body ;
            });
    });

    it('should save with id', () => {
        return request.post('/api/actors')
            .set('Authorization', token)
            .send(actor)
            .then( ({body}) => assert.equal(body.name, actor.name) );
    });

    it('should post and get actor by id', () => {
        return request.get(`/api/actors/${actorTest._id}`)
            .then( ({body}) => {
                assert.equal(body.films[0].title, film.title );
                assert.equal(body.name, body.name);
            });
    });

    it('should get all actors as array', () => {
        return request.get('/api/actors')
            .then( got => {
                assert.deepEqual(got.body.length, 1); 
            });
    });

    it('should delete by id', () => {
        return request.post('/api/actors/')
            .set('Authorization', token)
            .send(actor)
            .then( (res)=> {
                return request.delete(`/api/actors/${res.body._id}`)
                    .set('Authorization', token);
            })
            .then(res => {
                assert.equal(res.body.name, actor.name);
            });
    });

    it( 'updates actor by id', () => {
        const update = {name: 'updated'};
        return request.post('/api/actors')
            .set('Authorization', token)
            .send(actor)
            .then(res => {
                return request.put(`/api/actors/${res.body._id}`)
                    .set('Authorization', token)
                    .send(update);
            })
            .then (got => {
                assert.equal('updated', got.body.name);
            });
    });

});