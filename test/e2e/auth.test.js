const request = require('./request');
const assert = require('chai').assert;
const mongoose = require('mongoose');

describe.only('Authorization route', () => {
    beforeEach(() => mongoose.connection.dropDatabase());

    describe('signup', () => {

        it('signs up a user and returns their token', async () => {
            
            const {body: token} = await request.post('/api/auth/signup')
                .send({
                    name: 'bob',
                    company: 'corkers unlimited',
                    email:  'rageAgainstTheTangerine@whitehouse.gov',
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
        
        it('invalidates duplicate email', async () => {
            try {
                await request.post('/api/auth/signup')
                    .send({
                        name: 'bob',
                        company: 'corkers unlimited',
                        email:  'rageAgaintTheTangerine@whitehouse.gov',
                    });
                await request.post('/api/auth/signup')
                    .send({
                        name: 'bobbo',
                        company: 'corkers unlimited',
                        email:  'rageAgaintTheTangerine@whitehouse.gov',
                    });
            }
            catch(err) {
                assert.equal(err.status, 400);
            }
    
        });
    });    

    describe('sign in', () => {
        
        let userData = null;
        let token = null;

        beforeEach(async () => {

            userData = {
                name: 'bob',
                company: 'corkers unlimited',
                email:  'rageAgainstTheTangerine@whitehouse.gov',
                password: 'FUTrump'
            };

            try {
                await request.post('/api/auth/signup')
                    .send(userData);
            }
            catch(err) {
                console.log(err);
            }
        });

        it('checks to see that the email and password match and returns a token', async () => {
            let res = await request.post('/api/auth/signin')
                .send({name: userData.name, email: userData.email});
            
            const token = res.body;
            assert.ok(token);
        });
    });
});