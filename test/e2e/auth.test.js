const request = require('./request');
const assert = require('chai').assert;
const db = require('./db');

describe('Authorization API', () =>{

    beforeEach(db.drop);

    let token = null;
    beforeEach(() => {
        return request  
            .post('/api/auth/signup')
            .send({
                email: 'bob',
                password: 'bob'
            })
            .then(({ body }) => token = body.token);
    });

    it('signup', () =>{
        assert.ok(token);
    });
    
});