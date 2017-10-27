const request = require('./request');
const { assert } = require('chai');
const mongoose = require('mongoose');

describe('Authentication API', () => {

    beforeEach( () => mongoose.connection.dropDatabase());
    let token = null;
    
    beforeEach( () =>{
        return request.post('/api/auth/signup')
            .send({name: 'Mr Reviewer', company: 'reviewLLC', email:'user', password:'abc'})
            .then( ({body}) =>{
                token = body.token;
            });
    });
    
    it('should give a token on signup', () => {
        assert.ok(token);
    });

    it('cant sign up with the same email', ()=> {
        return request.post('/api/auth/signup')
            .send({name: 'Mr Reviewer', company: 'reviewLLC', email:'user', password:'abc'})
            .then(
                () => {throw new Error('Unexpected success which is bad');},
                err => {
                    assert.equal(err.status, 400);
                }
            );
    });     
    
    it('cant sign up without password', () => {
        return request.post('/api/auth/signup')
            .send({name: 'not the same', company: 'another', email:'different'})
            .then(
                () => {throw new Error('Unexpected success which is bad');},
                err => {
                    assert.equal(err.status, 400);
                }
            );
    });

    it('should sign in with the same credentials',() => {
        return request.post('/api/auth/signin')
            .send({ email:'user', password:'abc'})
            .then( ({ body }) => assert.ok(body.token));
    });

    it('should reject reviewer with bad email', ()=> {
        return request.post('/api/auth/signin')
            .send({ email:'user2', password:'abc'})
            .then(
                () => {throw new Error('Unexpected success which is bad');},
                err => {
                    assert.equal(err.status, 401);
                }
            );
    });

    it('should reject a request to protected route without token (401)', () => {
        return request.post('/api/actors')
            .set('Authorization', 'badToken')
            .send({name:'Bad Gibson'})
            .then(
                () => {throw new Error('He got through!!!');},
                err => assert.equal(err.status, 401)
            );
    });

    it.only('should reject a request to protected route without proper role (403)', () => {
        return request.post('/api/actors')
            .set('Authorization', token)
            .send({name:'Bad Gibson'})
            .then(
                () => {throw new Error('He got through!!!');},
                err => {
                    assert.equal(err.status, 403);
                }
            );
    });

});