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
    describe('GET Reviewer', () => {
        it('returns all with no given id', () => {
            const saveAll = [
                request.post('/api/reviewers')
                    .send(rawData[0]),
                request.post('/api/reviewers')
                    .send(rawData[1])
            ];

            return Promise.all(saveAll)
                .then(resArray => {
                    resArray = resArray.map(res => {
                        return {
                            name: res.body.name,
                            _id: res.body._id
                        };
                    });
                    return request.get('/api/reviewers')
                        .then(gotten => {
                            assert.deepInclude(gotten.body, resArray[0]);
                            assert.deepInclude(gotten.body, resArray[1]);
                        });
                });
        });
        it('returns reviewer by id', () => {
            return request.post('/api/reviewers')
                .send(rawData[0])
                .then(res => {
                    const saved = res.body;
                    delete saved.__v;
                    return request.get(`/api/reviewers/${saved._id}`)
                        .then(getRes => assert.deepEqual(getRes.body, saved));     
                });
        });
    });
    describe('DELETE Reviewer', () => {
        it('given a valid id returns true', () => {
            return request.post('/api/reviewers')
                .send(rawData[0])
                .then( res => {
                    return request.del(`/api/reviewers/${res.body._id}`)
                        .then(({body: status}) => {
                            assert.deepEqual(status, {removed: true});
                        });
                });
        });
    });
});