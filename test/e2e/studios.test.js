const { assert } = require('chai');
const mongoose = require('mongoose');
const request = require('./request');
const Reviewer = require('../../lib/models/reviewer');

describe('Studios API', () => {
    
    beforeEach(() => {
        mongoose.connection.dropDatabase();
    });

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

    const studio = {
        name: 'Universal',
        address: {
            city: 'LA',
            state: 'Calignfg'
        }
    };

    const anotherStudio = {
        name: 'Pixar',
        address: {
            city: 'somewhere else',
            state: 'Calignfg'
        }
    };



    it('should save with id', () => {
        return request.post('/api/studios')
            .set('Authorization', token)
            .send(studio)
            .then( ({ body }) => {
                assert.equal(body.name, studio.name);
            });
    });

    it('should get by id', () => {
        let myFilm = null;
        let myActor = null;
        let myStudio = null;

        return request.post('/api/actors')
            .set('Authorization', token)
            .send({name: 'Shrek Gibson'})
            .then( (actor) => myActor = actor)
            .then( () => request.post('/api/studios')
                .set('Authorization', token)
                .send({name:'Universal'}) )
            .then( studio => {
                myStudio = studio.body; 
            })
            .then( () => {
                return request.post('/api/films')
                    .set('Authorization', token)
                    .send({
                        title: 'Shrek 4',
                        studio: myStudio._id,
                        released: 2000,
                        cast: {
                            actor: myActor.body._id 
                        }
                    });
            })
            .then( film => myFilm = film )
            .then( () => {
                return request.get(`/api/studios/${myStudio._id}`);
            })            
            .then( got => {
                assert.equal(got.body.name, myStudio.name);
                assert.equal(got.body.film.title, myFilm.title);
            });
    });

    it('should return error 400 when getting by invalid id', () => {
        return request.get('/api/studios/lksdjfklsdskjd')
            .then( 
                () => { throw new Error('unexpected success'); },
                got => {
                    assert.equal(got.status, 400);
                });
    });

    it('should get array of all studios', () => {
        return request.post('/api/studios')
            .set('Authorization', token)
            .send([studio, anotherStudio])
            .then( () => request.get('/api/studios'))                  
            .then( ({ body }) => {
                assert.ok(body.find( s => s.name === studio.name ));
                assert.ok(body.find( s => s.name === anotherStudio.name ));
            });
    });

    it('should update existing studio', () => {
        const update = {name: 'updated'};
        return request.post('/api/studios')
            .set('Authorization', token)
            .send(studio)
            .then(res => {
                return request.put(`/api/studios/${res.body._id}`)
                    .set('Authorization', token)
                    .send(update);
            })
            .then(got => {
                assert.equal('updated', got.body.name);
            });
            
    });

    it('should delete by id', () => {
        return request.post('/api/studios/')
            .set('Authorization', token)
            .send(studio)
            .then( (res)=> {
                return request.delete(`/api/studios/${res.body._id}`).set('Authorization', token);
            })
            .then(res => assert.equal(res.body.name, 'Universal'));
    });

    it('should not delete if there is a film with that studio', () => {
        let myActor = null;
        let myStudio = null;

        return request.post('/api/actors')
            .set('Authorization', token)
            .send({name: 'Shrek Gibson'})
            .then( (actor) => myActor = actor)
            .then( () => {
                return request.post('/api/studios')
                    .set('Authorization', token)
                    .send({name:'Universal'}); 
            })
            .then( studio => {
                myStudio = studio.body; 
            })
            .then( () => {
                return request.post('/api/films')
                    .set('Authorization', token)
                    .send({
                        title: 'Shrek 4',
                        studio: myStudio._id,
                        released: 2000,
                        cast: {
                            actor: myActor.body._id 
                        }
                    });
            })
            .then( () => { 
                return request.delete(`/api/studios/${myStudio._id}`)
                    .set('Authorization', token);
            })
            .then ( ({body}) =>{
                assert.equal(body.deleted, 'delete films first');
            });
    });

});