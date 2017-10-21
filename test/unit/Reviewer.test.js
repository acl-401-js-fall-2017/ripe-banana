const {assert} = require('chai');
const Reviewer = require('../../lib/models/Reviewer');

describe('Reviewer model', () => {
    let rawData = null;

    beforeEach(() => rawData = {
        name: 'Mel',
        company: 'film blog of mel'
    });

    it('valid model', () => {
        const mel = new Reviewer(rawData);
        
        assert.ok(!mel.validateSync());
        assert.ok(mel.name);
    });

    it('required fields included', () => {
        delete rawData.name;
        const mel = new Reviewer(rawData);

        assert.equal(mel.validateSync().errors.name.kind, 'required');
    });
});