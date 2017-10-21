const {assert} = require('chai');
const Actor = require('../../lib/models/Actor');

describe('Actor Model', () => {
    let rawData = null;

    beforeEach(() => rawData = {
        name: 'Steven',
        dob: new Date('2017-10-20'),
        pob: '30th NW 10th Ave, Portland Oregon 97209'
    });

    it('Valid Model', () => {
        const steve = new Actor(rawData);

        assert.ok(!steve.validateSync());
        assert.ok(steve.name);
    });
});