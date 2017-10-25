const request = require('./request');
const mongoose = require('mongoose');
const assert = require('chai').assert;

describe('Reviewer API', () => {

    beforeEach(() => mongoose.connection.dropDatabase());

    const reviewer = {
        name: 'Roger Ebert',
        company: 'Siskel & Ebert'
    };

    it('saves a reviewer', () => {
        return request.post('/api/filmIndustry/reviewers')
            .send(reviewer)
            .then(({ body }) => {
                assert.equal(body.name, reviewer.name);
            });
    });

    it('gets a reviewer wit an id', () => {
        return request.post('/api/filmIndustry/reviewers')
            .send(reviewer)
            .then(res => {
                return request.get(`/api/filmIndustry/reviewers/${res.body._id}`);
            })
            .then(res => {
                assert.equal(res.body.name, reviewer.name);
            });
    });

    it('get by id return 404 with bad id', () => {
        return request.get('/api/filmIndustry/reviewers/59eb8057ea2b371badf14536')
            .then(
                () => {throw new Error('Unexpected error');},
                err => {
                    assert.equal(err.status, 404);
                });
    });

    it('get all reviewers',() => {
        const reviewer2 = {
            name:'Gene Siskel',
            company:'Siskel & Ebert'};

        let reviewerCollection = [reviewer, reviewer2].map(item => {
            return request.post('/api/filmIndustry/reviewers')
                .send(item)
                .then(res => res.body);
        });

        let saved = null;
        return Promise.all(reviewerCollection)
            .then(_saved => {
                saved =_saved;
                return request.get('/api/filmIndustry/reviewers');
            })
            .then(res => {
                assert.deepEqual(res.body, saved);
            });
    });

    it('updates reviewer with an id', () => {
        const update = { 
            name:'Gene Siskel',
            company:'Siskel & Ebert'
        };
        return request.post('/api/filmIndustry/reviewers')
            .send(reviewer)
            .then(res => {
                return request.put(`/api/filmIndustry/reviewers/${res.body._id}`).send(update);
            })
            .then(res => {
                assert.equal(res.body.name, update.name);
            });

    });




});
