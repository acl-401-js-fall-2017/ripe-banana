const db = require('./db');
const request = require('./request');
const assert = require('chai').assert;

describe('films API', ()=> {
    beforeEach(() => mongoose.connection.dropDatabase());

    let studio = { 
        name: 'Warner',
        address: {
            city: 'Hollywood',
            state: 'CA'
        }
    };

    before(() => {
        return request.post('/studios')
            .send(studio)
            .then( res => res.body)
            .then(saved => studio = saved);
    });

    it('first GET shoudl return empty array', () => {
        return request.get('/films')
            .then(res => res.body)
            .then(films => assert.deepEqual(films, []));
    });

});
