const request = require('./request');
const assert = require('chai').assert;
const mongoose = require('mongoose');
// const db = require('./db');

describe.only('Auth Api', () => {
    beforeEach(() => mongoose.connection.dropDatabase());

    let token = null;
    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send({
                email: 'testUser1',
                password: 'abc'
            })
            .then(({ body }) => token = body.token);
    });

    it('signup', () => {
        assert.ok(token);
    });

    it('can not signup with same email', () => {
        return request
            .post('/api/auth/signup')
            .send({ 
                email: 'testUser1',
                password: 'def'})
            .then(
                () => { throw new Error('unexpected successful response'); },
                err => {
                    assert.equal(err.status, 400);
                }
            );
    });

    it('Must include password', () => {
        return request
            .post('/api/auth/signup')
            .send( {
                email: 'testUser2',
                password: ''
            })
            .then(
                () => { throw new Error('unexpected successful response'); },
                err => {
                    assert.equal(err.status, 400);
                });
    });
});