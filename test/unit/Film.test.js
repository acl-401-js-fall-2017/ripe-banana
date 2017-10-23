const {assert} = require('chai')
const Studio = require('../../lib/models/Studio');
const Actor = require('../../lib/models/Actor');
const Film = require('../../lib/models/Film');

describe('Film model', () => {
    
    let instStudio = null;
    let instActor = null;
    let instActor2 = null;
    before(() => {
        instStudio = new Studio({name: 'paramount'});
        instActor = new Actor({name: 'jack'});
        instActor2 = new Actor({name: 'jill'});
    });
    
    let rawData = null;

    beforeEach(() => {
        rawData = {
            title: 'Halloween',
            studio: instStudio._id,
            released: 2000,
            cast: [
                {
                    part: 'damsel in distress',
                    actor: instActor._id
                },
                {
                    part: 'lead',
                    actor: instActor2._id
                }
            ]
        };
    });

    it('constructs a valid film with a new mongo id', () => {
        const newMov = new Film(rawData);
        assert.ok(newMov._id);
        assert.ok(!newMov.validateSync());
    })

});