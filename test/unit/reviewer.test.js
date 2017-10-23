const assert = require('chai').assert; 
const Reviewer = require('../../lib/models/reviewer');


describe('reviewer model', () => {

    it('Validates a good model', () => {
        const reviewer = new Reviewer({
            name: 'Kate Taylor',
            company: 'Globe and Mail'
        });
        assert.equal(reviewer.validateSync(), undefined);

    });

    it('checks for required fields', ()=> {
        const reviewer = new Reviewer({});
        const { errors } = reviewer.validateSync(); 
        assert.equal(errors.name.kind, 'required');
    });

});