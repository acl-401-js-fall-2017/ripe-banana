const {assert} = require('chai');
const Studio = require('../../lib/models/Studio');

describe('Studio Model', () => {
    
    let rawData = null;

    beforeEach(() => {
        rawData = {
            name: 'Touchstone Studio',
            address: {
                city: 'Portland',
                state: 'New Zealand',
                country: 'Mars'
            }
        };
    });
    
    it('valid model', () => {
        const ts = new Studio(rawData);
        assert.ok(!ts.validateSync());
        assert.ok(ts.name);
    });
});