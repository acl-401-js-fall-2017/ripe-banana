const assert = require('chai').assert; 
const Actor = require('../../lib/models/actor');


describe('Actor model', () => {

    it('Validates a good model', () => {
        const actor = new Actor({
            name: 'Kevin Bacon',
            dob: 'July 8, 1958',
            pob: 'Philadelphia, Pennsylvania, USA'
        });
        assert.equal(actor.validateSync(), undefined);

    });

    it('checks for required fields', ()=> {
        const actor = new Actor({});
        const { errors } = actor.validateSync(); 
        assert.equal(errors.name.kind, 'required');
    });

});