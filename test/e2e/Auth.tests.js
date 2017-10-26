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

    it.only('signup', () => {
        assert.ok(token);
    });
});