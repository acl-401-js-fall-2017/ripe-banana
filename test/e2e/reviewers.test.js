const {assert} = require('chai');
const mongoose = require('mongoose').connection;
const request = require('./request');

describe('Reviewer CRUD', () => {
    let rawData = null;
    
    beforeEach(() => {
        mongoose.dropDatabase();
        rawData = [
            {
                name: 'mel',
                company: 'film blog of mel'
            },
            {
                name: 'gibson',
                company: 'film blog of gibson'
            }
        ];
    });

    describe('POST Reviewer', () => {
        it('returns reviewer with new id', () => {
            return request.post('/api/reviewers')
                .send(rawData[0])
                .then( res => assert.ok(res.body._id));
        });
    });
});