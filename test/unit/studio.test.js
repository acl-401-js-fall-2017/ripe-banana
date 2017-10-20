const assert = require('chai').assert; 
const Studio = require('../../lib/models/studio');


describe('Studio model', () => {

    it('Validates a good model', () => {
        const studio = new Studio({
            name: 'Fox',
            address: {
                city: 'Los Angeles',
                state: 'California',
                country: 'USA'
            }
        });
        assert.equal(studio.validateSync(), undefined);

    });

    it('checks for required fields', ()=> {
        const studio = new Studio({});
        const { errors } = studio.validateSync(); 
        assert.equal(errors.name.kind, 'required');
    });

});