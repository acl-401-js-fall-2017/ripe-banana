const request = require('./request');
const { assert } = require('chai');
const db = require('./db');

describe.only('Auth API', () => {

    beforeEach(db.drop);

    let token = null;

    beforeEach(() => {
        return request.post('/api/auth/signup')
            .send({
                email: 'user@email.com',
                password: 'four',
                name: 'Zach',
                company: 'Alchemy Code Lab'
            })
            .then(({body}) =>  {
                token = body.token;
            });
    });

    it('signup', () => {
        assert.ok(token);
    });

    it('Can not signup with same email', () => {
        return request.post('/api/auth/signup')
            .send({
                email: 'user@email.com',
                password: 'fourfour',
                name: 'Zach',
                company: 'Alchemy Code Lab'
            })
            .then(
                () => { throw new Error('Unexpected successful response'); },
                err => {
                    assert.equal(err.status, 400);
                }
            );
    });

});
