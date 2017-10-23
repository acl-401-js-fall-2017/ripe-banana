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
    });
    
    it('invalidates film without title and studio id', () => {
        delete rawData.title;
        delete rawData.studio;
        const newMov = new Film(rawData);
        assert.ok(newMov._id);
        assert.equal(newMov.validateSync().errors.title.kind, 'required');
        assert.equal(newMov.validateSync().errors.studio.kind, 'required');
    });
    
    it('invalidates film without a valid 4 digit year', () => {

        rawData.released = 19887;
        const newMov = new Film(rawData);
        assert.ok(newMov._id);
        assert.equal(newMov.validateSync().errors.released.message, 'not a 4 digit year');
    });
    
    it('invalidates film with cast missing actor', () => {
        delete rawData.cast[0].actor;
        const newMov = new Film(rawData);
        assert.ok(newMov._id);
        assert.equal(newMov.validateSync().errors['cast.0.actor'].kind, 'required');
    });  
});