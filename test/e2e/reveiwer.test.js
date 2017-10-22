const assert = require('chai').assert;
const mongoose = require('mongoose');
const request = require('./request');


describe('reviewer API', () => {
    beforeEach(()=> mongoose.connection.dropDatabase());

    const kateTaylor = {
        name: 'Kate Taylor',
        company: 'Globe and Mail'
    };

    it('saves a reviewer with id', ()=>{
        return request.post('/api/reviewers')
            .send(kateTaylor)
            .then(res => {
                const reviewer = res.body;
                assert.ok(reviewer._id);
                assert.equal(reviewer.name, kateTaylor.name);
            });
    });


})

