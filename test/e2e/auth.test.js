const request = require('./request');
const { assert } = require('chai');
const db = require('./db');

describe('Auth API', () => {

    beforeEach(db.drop);

    let token = null;

    beforeEach(() => {
        return request.post('/api/auth/signup')
            .send({
                email: 'user@email.com',
                password: 'four',
                name: 'Zach',
                company: 'Alchemy Code Labs'
            })
            .then(({body}) =>  {
                token = body.token;
            });
    });

    it.only('signup', () => {
        assert.ok(token);
    });
});