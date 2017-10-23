const request = require('./request');
const mongoose = require('mongoose');
const assert = require('chai').assert;


describe('Actors API', () => {
    
    beforeEach(() => mongoose.connection.dropDatabase());

    const actor = {
        name: 'George Clooney',
        dob: 1961,
        pob: 'Lexington KY'
    };

    it('saves an actor', () => {
        return request.post('/api/filmIndustry/actors')
            .send(actor)
            .then(({ body }) => {
                assert.equal(body.name, actor.name);
            });
    });

    it('get actor with an id', () => {
        let savedActor =null;
        return request.post('/api/filmIndustry/actors')
            .send(actor)
            .then(res => {
                savedActor = res.body;
                // console.log('actor id', res.body._id);
                return request.get(`/api/filmIndustry/actors/${savedActor._id}`);
            })
            .then(res => {
                assert.deepEqual(res.body, savedActor);
            });
    });

    it('get by id return 404 with bad id', () => {
        return request.get('/api/filmIndustry/actors/59eb8057ea2b371badf14536')
            .then(
                () => {throw new Error('Unexpected error');},
                err => {
                    assert.equal(err.status, 404);
                });
    });

    it('get all actors',() => {
        const actor2 = {
            name: 'Tom Hanks',
            dob: 1956,
            pob: 'Concord CA'
        };

        let actorCollection = [actor, actor2].map(item => {
            return request.post('/api/filmIndustry/actors')
                .send(item)
                .then(res => res.body);
        });

        let saved = null;
        return Promise.all(actorCollection)
            .then(_saved => {
                saved =_saved;
                return request.get('/api/filmIndustry/actors');
            })
            .then(res => {
                assert.deepEqual(res.body, saved);
            });
    });

    it('updates actor with an id', () => {
        const update = { 
            name:'Charlie Chaplin',
            dob: 1961,
            pob: 'Lexington KY'
        };
        return request.post('/api/filmIndustry/actors')
            .send(actor)
            .then(res => {
                return request.put(`/api/filmIndustry/actors/${res.body._id}`).send(update);
            })
            .then(res => {
                assert.equal(res.body.name, update.name);
            });

    });

});
