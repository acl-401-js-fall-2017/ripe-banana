const { assert } = require('chai');
const Studio = require('../../lib/models/studio');


describe('Studio test', () => {

    it('should validate a good model', () => {
        const studio = new Studio({
            name: 'myStudio LLC',
            address: {
                city: 'Townsville',
                state: 'CA',
                country: 'AMERICA'
            }
        });

        const validate = studio.validateSync();

        assert.equal(validate, undefined);

    });

    it('should return error if name not provided', () => {
        const studio = new Studio({});

        const { errors } = studio.validateSync();

        assert.equal(errors.name.kind, 'required');
    });


});