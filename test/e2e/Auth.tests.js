const request = require('./request');
const assert = require('chai').assert;
const mongoose = require('mongoose');

describe('Auth API', () => {

    let token = null; 
    beforeEach(() => mongoose.connection.dropDatabase());
    beforeEach(()=>{
        return request 
            .post('/api/auth/signup')
            .send({
                name: 'Shane Moyo',
                company: 'Shane Co.',
                email: 'user',
                password: 'abc'
            })
            .then(({ body }) => token = body.token);
    });

    it('signup', () => {
        assert.ok(token);
    });

    it('Can not signup with same email', ()=>{
        return request
            .post('/api/auth/signup')
            .send({
                name: 'Shane Moyo',
                company: 'Shane Co.',
                email: 'user',
                password: 'def'
            })
            .then(
                () => {throw new Error('Unexpected successful response'); },
                err => {
                    assert.equal(err.status, 400);
                }
            );

    });

    it('Must include password', () => {
        return request 
            .post('/api/auth/signup')
            .send({
                name: 'Shane Moyo',
                company: 'Shane Co.',
                email: 'user',
                password: ''
            })
            .then(
                () => { throw new Error('Unexpected successful respone'); },
                err => {
                    assert.equal(err.status, 400);
                }
            );
    });

    it('Signin with same credential', ()=>{
        return request
            .post('/api/auth/signin')
            .send({
                name: 'Shane Moyo',
                company: 'Shane Co.',
                email: 'user',
                password: 'abc'
            })
            .then(({ body })=>{
                assert.isOk(body.token);
            });
    });

    it.only('Signin rejected with bad eamil', ()=>{
        return request  
            .post('/api/auth/signin')
            .send({
                name: 'Shane Moyo',
                company: 'Shane Co.',
                email: 'bbbbbad',
                password: 'abc'
            })
            .then(
                () => { throw new Error('Unexpected successful response'); },
                err => {
                    assert.equal(err.status, 401);
                }
            );
    });
});