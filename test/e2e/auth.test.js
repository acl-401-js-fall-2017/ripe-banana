const request = require('./request');
const assert = require('chai').assert;
const mongoose = require('mongoose');

describe.only('Authorization route', () => {
    beforeEach(() => mongoose.connection.dropDatabase());
    
    it('signs up a user and returns their token', async () => {
        const {body: token} = await request.post('/api/auth/signup')
            .send({
                name: 'bob',
                company: 'corkers unlimited',
                email:  'rageAgaintTheTangerine@whitehouse.gov',
                password: 'FUTrump'
            });
        assert.isOk(token);
    });

    it('requires a password', async () => {
        try {
            await request.post('/api/auth/signup')
                .send({
                    name: 'bob',
                    company: 'corkers unlimited',
                    email:  'rageAgaintTheTangerine@whitehouse.gov',
                });
        }
        catch(err) {
            assert.equal(err.status, 400);
        }
    });

});