const request = require('./request');
const mongoose = require('mongoose');
const assert = require('chai').assert;

describe('Studios API', () => {

    beforeEach(() => mongoose.connection.dropDatabase());

    const studio = {
        name: 'Paramount Pictures',
        address: {
            city: 'Hollywood',
            state: 'California',
            country: 'USA'
        }
    };

    it('saves a studio', () => {
        return request.post('/api/filmIndustry/studios')
            .send(studio)
            .then(({ body }) => {
                assert.equal(body.name, studio.name);
            });
    });

    it('gets a studio with an id', () => {
        let savedStudio = null;
        return request.post('/api/filmIndustry/studios')
            .send(studio)
            .then(res => {
                savedStudio = res.body;
                return request.get(`/api/filmIndustry/studios/${savedStudio._id}`);
            })
            .then(res => {
                assert.deepEqual(res.body, savedStudio);
            });
    });

    it('gets by id and returns a 404 with a bad id', () => {
        const update = {
            name: 'Paramount Pictures',
            address: {
                city: 'Hollywood',
                state: 'California',
                country: 'USA'
            }
        };
        return request.post('/api/filmIndustry/studios')
            .send(studio)
            .then(res => {
                return request.put(`/api/filmIndustry/studios/${res.body._id}`).send(update);
            })
            .then(res => {
                assert.equal(res.body.name, update.name);
            });
    });

    it('removes by id', () => {
        let studio = null;
        return request.post('/api/studios')
            .send(studio)
            .then(res => {
                studio = res.body;
                return request.delete(`/api/studios/${studio._id}`);
            })
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
                return request.get(`/api/studio/${studio._id}`);
            })
            .then(
                () => { throw new Error('Unexpected successful response'); },
                err => {
                    assert.equal(err.status, 404);
                }
            );
    });

});
