const { assert } = require('chai');
const Actor = require('../../lib/models/actor');


describe('Actor test', () => {
    
    const actor = new Actor({
        name: 'rongy bringus',
        dob: 2000,
        pob: 'japan'
    });

    it('should validate a good model', () => {

        const validate = actor.validateSync();

        assert.equal(validate, undefined);

    });

    it('should return error if name not provided', () => {
        let badActor = new Actor({});

        const { errors } = badActor.validateSync();

        assert.equal(errors.name.kind, 'required');
    });

});