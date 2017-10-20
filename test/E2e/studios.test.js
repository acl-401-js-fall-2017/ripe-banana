const assert = require('chai').assert;
const mongoose = require('mongoose');
const request = require('./request');

describe('studios API', () => {
    beforeEach(() => mongoose.connection.dropDatabase());

    const warner = {
        name: 'Warner'
    };

    it('saves a studio with ID', () => {
        return request.post('/api/studios')
            .send(warner)
            .then(res => {
                const studio = res.body;
                assert.ok(studio._id);
                assert.equal(studio.name, warner.name);
            });
    });
});