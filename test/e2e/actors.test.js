const  {assert} = require('chai');
const mongoose = require('mongoose');
const request = require('./request');

describe('Actor API', () => {

    const actor = {
        name: 'Mel Gibson'
    };

    const actor2 = {
        name: 'Matt Daemon'
    };

    beforeEach( () => mongoose.connection.dropDatabase());

    it('should save with id', () => {
        return request.post('/api/actors')
            .send(actor)
            .then( ({body}) => assert.equal(body.name, actor.name) );
    });


    it('should post and get actor by id', () => {
        let saved = null;
        return request.post('/api/actors')
            .send(actor)
            .then( ({body}) => {
                saved = body;
                return request.get(`/api/actors/${saved._id}`);
            })
            .then( ({body}) => {
                assert.equal(saved.films, null);
                assert.equal(saved.name, body.name);
            });
    });


    it('it should get all actors as array', () => {
        let saved = null;
        return request.post('/api/actors').send([actor,actor2])
            .then( ({body}) => {
                saved = body;
                return request.get('/api/actors');
            })
            .then( got => {
                assert.deepEqual(got.body, saved); 
            });
    });

    it('should delete by id', () => {
        return request.post('/api/actors/')
            .send(actor)
            .then( (res)=> {
                return request.delete(`/api/actors/${res.body._id}`);
            })
            .then(res => {
                assert.equal(res.body.name, actor.name);
            });
      
    });

    it( 'updates actor by id', () => {
        const update = {name: 'updated'};
        return request.post('/api/actors')
            .send(actor)
            .then(res => {
                return request.put(`/api/actors/${res.body._id}`)
                    .send(update);
            })
            .then (got => {
                assert.equal('updated', got.body.name);
            });



    });

});