const {assert} = require('chai');
const mongoose = require('mongoose').connection;
const request = require('./request');

describe('actor CRUD', () => {
    let rawData = null;

    beforeEach(() => {
        mongoose.dropDatabase();
        rawData = [
            {
                name: 'Steven',
                dob: new Date('2017-10-20'),
                pob: '30th NW 10th Ave, Portland, Oregon 97209'

            },
            {
                name: 'Oprah'
            }
        ];
    });

    describe('POST Actor', () => {
        it('returns actor with new id', () => {
            return request.post('/api/actors')
                .send(rawData[0])
                .then(res => assert.ok(res.body._id));
        });
    });

    describe('GET Actor', () => {
        it('returns all when no id', () => {
            const saveAll = [
                request.post('/api/actors')
                    .send(rawData[0]),
                request.post('/api/actors')
                    .send(rawData[1])
            ];

            return Promise.all(saveAll)                
                .then(resArray => {
                    resArray = resArray.map((res) => {
                        return {
                            name: res.body.name,
                            _id: res.body._id
                        };
                    });
                    return request.get('/api/actors')
                        .then(gotten => {
                            assert.deepInclude(gotten.body, resArray[0]);
                            assert.deepInclude(gotten.body, resArray[1]);
                        });
                });
                
        });
        it('get actor by id', () => {
            return request.post('/api/actors')
                .send(rawData[1])
                .then(res => {
                    const saved = res.body;
                    delete saved.__v;
                    return request.get(`/api/actors/${saved._id}`)
                        .then(getRes => {
                            assert.deepEqual(getRes.body, saved);
                        });
                });

        });
    });
});