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

    // describe('GET Actor', () => {
    //     it('returns all when no id', () => {
    //         return request.
    //     })
    // })
});