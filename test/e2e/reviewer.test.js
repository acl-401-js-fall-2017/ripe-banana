const { assert } = require('chai');
const mongoose = require('mongoose');
const request = require('./request');

describe('Reviewers API', () => {


    const reviewerOne = {
        name: 'John Doe',
        company: 'Enron'
    };

    const reviewerTwo = {
        name: 'Jane Doe',
        company: 'Halliburton'
    };

    beforeEach(() => {
        mongoose.connection.dropDatabase();
    });


    it('should save with id', () => {
        return request.post('/api/reviewers')
            .send(reviewerOne)
            .then( ({ body }) => {
                assert.equal(body.name, reviewerOne.name);
            });
    });

    it('should return array of all reviewers, including name and company', () => {
        return Promise.all([
            request.post('/api/reviewers').send(reviewerOne),
            request.post('/api/reviewers').send(reviewerTwo)
        ])
            .then( () => request.get('/api/reviewers'))
            .then( ({body}) => {
                assert.equal( body.length, 2);
                assert.equal( body[0].name, 'John Doe');
            });
    });


    it('should get reviewer by id, returning name, company, and reviews [film.name, rating, review]', ()=> {
        return request.post('/api/reviewers')
            .send(reviewerOne)
            .then( ({ body }) => {
                return request.get(`/api/reviewers/${body._id}`);
            })
            .then( ({body}) => {
                assert.equal(body.name, reviewerOne.name);
                assert.equal(body.reviews.rating, reviewOne.rating);
                assert.equal(body.reviews.review, reviewOne.review);

            });
    });

});