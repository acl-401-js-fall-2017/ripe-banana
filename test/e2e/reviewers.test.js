const request = require('./request');
const mongoose = require('mongoose');
const assert = require('chai').assert;

describe('Reviewer API', () => {
    let studio = {
        name: 'MGM'
    };

    let actor = {
        name: 'Ryan Gosling'
    };
    
    let reviewer = {
        name: 'Roger Ebert',
        company: 'Siskel & Ebert'
    };

    beforeEach(() => mongoose.connection.dropDatabase());

    beforeEach(() => {
        
        return request.post('/api/filmIndustry/reviewers')
            .send(reviewer)
            .then(({ body }) => {
                reviewer._id = body._id;
                return body;
            })
            .then(()=>{
                return request.post('/api/filmIndustry/studios')
                    .send(studio)
                    .then(({ body }) => {
                        studio._id = body._id;
                        return body;
                    });
            }) 
            .then(() => {
                return request.post('/api/filmIndustry/actors')
                    .send(actor)
                    .then(({ body }) => {
                        actor._id = body._id;
                        return body;
                    });     
            })
            .then(() => {
                let testMovie = {
                    title: 'Wonder Woman',
                    studio: studio._id,
                    released: 2017,
                    cast: [{actor: actor._id}]
                };
                return request.post('/api/filmIndustry/films')
                    .send(testMovie)
                    .then(({ body }) => {
                        testMovie._id = body._id;
                        return body;
                    });
            }) 
            .then((testMovie)=>{
                let review ={ 
                    rating: 4,
                    reviewer: reviewer._id,
                    review_text: 'Simply Amazing',
                    film: testMovie._id
                };
                return request.post('/api/filmIndustry/reviews/') 
                    .send(review)
                    .then(({ body }) => {
                        review._id = body._id;
                        return body;
                        
                    });
            });

    });

    
    it('saves a reviewer', () => {
        let reviewer1 = {
            name: 'Roger Ebert',
            company: 'Siskel & Ebert'
        };
        return request.post('/api/filmIndustry/reviewers')
            .send(reviewer1)
            .then(({ body }) => {
                assert.equal(body.name, reviewer.name);
            });
    });
    
    it('gets a reviewer with an id', () => {
        return request.get(`/api/filmIndustry/reviewers/${reviewer._id}`)
            .then(({ body }) => {
                assert.equal(body.name, reviewer.name);
            });
    });

    it('get all reviewers',() => {

        let reviewer1 = {
            name: 'Erdem Ebert',
            company: 'Siskel & Ebert'
        };

        let reviewer2 = {
            name:'Gene Siskel',
            company:'Siskel & Ebert'};

        let reviewerCollection = [reviewer1, reviewer2].map(item => {
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
                assert.deepEqual(res.body[1].name, saved[0].name);
            });
    });

    it('updates reviewer with an id', () => {
        const update = { 
            name:'Someone Cool',
            company:'Siskel & Ebert'
        };

        let reviewerToUpdate = {
            name: 'Roger Ebert',
            company: 'Siskel & Ebert'
        };

        return request.post('/api/filmIndustry/reviewers')
            .send(reviewerToUpdate)
            .then(res => {
                return request.put(`/api/filmIndustry/reviewers/${res.body._id}`).send(update);
            })
            .then(res => {
                assert.equal(res.body.name, update.name);
            });

    });

});
