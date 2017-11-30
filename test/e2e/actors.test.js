const assert = require('chai').assert;
const mongoose = require('mongoose');
const request = require('./request');


describe('actors API', () => {
    beforeEach(() => mongoose.connection.dropDatabase());
    
    const kevin = {
        name: 'Kevin Bacon'
    };
    
    const amy = {
        name: 'Amy Adams'
    };

    const warner = {
        name: 'Warner'
    };
    
    let studio = null;
    let film = null;
    //let film2 = null;
    //let film3 = null;
    beforeEach(()=> {
        return request.post('/api/studios')
            .send(warner)
            .then(res => studio = res.body);
    });

    beforeEach(()=>{
        film =
            {
                title: 'Dumb and Dumberer',
                studio: studio._id,
                released: 1998,
            };
        return request.post('/api/films')
            .send(film)
            .then(res => film = res.body);
    });


    it('saves an actor with ID', () => {
        return request.post('/api/actors')
            .send(kevin)
            .then(res => {
                const actor = res.body;
                assert.ok(actor._id);
                assert.equal(actor.name, kevin.name);
            });
    });

    it
    ('Gets all actors', () =>{
        const saves = [kevin, amy].map(actor =>{
            return request.post('/api/actors')
                .send(actor)
                .then(res => res.body);
        });
        let saved = null;
        let savedNames = null;
        return Promise.all(saves)
            .then(_saved => {
                saved = _saved;
                savedNames = saved.map( save => { 
                    return {
                        _id: save._id,
                        name: save.name
                    }; 
                });
                let filmz = [{
                    title: 'Top Gun',
                    studio: studio._id,
                    released: 1992,
                    cast:[{part: 'lead', actor: savedNames[0]},{part: 'support', actor: savedNames[1]}]
                },
                {
                    title: 'Top Gun2',
                    studio: studio._id,
                    released: 2018,
                    cast:[{part: 'lead', actor: savedNames[0]},{part: 'support', actor: savedNames[1]}]
                },
                {
                    title: 'Harry Potter',
                    studio: studio._id,
                    released: 2001,
                    cast:[{part: 'lead', actor: savedNames[1]}]
                }];
                return Promise.all(filmz.map( each => {
                    return request.post('/api/films')
                        .send(each)
                        .then(res => res.body);
                }))
                    .then(()=>{
                        return request.get('/api/actors');
                    });
            })
            .then(res =>{
                savedNames[0].movieCount = 2;
                savedNames[1].movieCount = 3;
                console.log('I am the actors', savedNames);
                console.log('i am the response', res.body);
                let allActors = res.body.sort((a, b) => a._id < b._id);
                savedNames = savedNames.sort((a, b) => a._id < b._id);
                assert.deepEqual(allActors, savedNames);
            });
    });

    it('Gets Actor with id', () => {
        const bob = { name: 'Bob Saget' };
        let actor = null;
        return request.post('/api/actors')
            .send(bob)
            .then(res => {
                film.cast = [{
                    part: 'dad',
                    actor: res.body._id
                }];
                actor = res.body;
                return request.put(`/api/films/${film._id}`)
                    .send(film);
            })
            .then(()=>{      
                return request.get(`/api/actors/${actor._id}`);
            })
            .then(res => {
                assert.ok(res.body.films);
                assert.deepEqual('Dumb and Dumberer', res.body.films[0].title);
                assert.deepEqual(res.body.name, actor.name);
            });
    });

    it('Get by ID returns 404 for bad id', () => {
        return request.get('/api/actors/59e401db548d1096dde508b9')
            .then(
                () => {throw new Error('Incorrect ID'); },
                err => {
                    assert.equal(err.status, 404);
                });
    });

    it('Changes an actor by ID', ()=> {
        const badActor= {
            name:'Kevin Sausage'
        };
        let savedActor = null;

        return request.post('/api/actors')
            .send(badActor)
            .then( res => savedActor = res.body)
            .then(() => {
                badActor.name = 'Kevin Bacon';
                return request
                    .put(`/api/actors/${savedActor._id}`)
                    .send( badActor);
            })
            .then( res => {
                assert.deepEqual( res.body.nModified === 1, true);
            });
    });

    it('Deletes Actor by ID', () =>{
        let actor = null;
        return request.post('/api/actors')
            .send(amy)
            .then(res => {
                actor = res.body;
                return request.delete(`/api/actors/${actor._id}`);
            })
            .then( res => {
                assert.deepEqual(res.body, { removed: true});
                return request.get(`/api/actors/${actor._id}`);
            })
            .then( 
                () => { throw new Error('Unexpected successful response');},
                err => {
                    assert.equal(err.status, 404);
                }
            );
    });

    it('does not delete actor in films', () => {
        let actor = null; 
        return request.post('/api/actors')
            .send(kevin)
            .then(res => {
                return actor = res.body;
            })
            .then(() => {
                film.cast = [{
                    part: 'dad',
                    actor: actor._id
                }];
                return request.put(`/api/films/${film._id}`)
                    .send(film);
            })
            .then(()=>{
                return request.delete(`/api/actors/${actor._id}`)
                    .then(res => {
                        assert.deepEqual(res.body, { removed: false });
                    });
            });


            
    });

});