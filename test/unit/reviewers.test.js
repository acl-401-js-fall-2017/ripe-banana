const { assert } = require('chai');
const Reviewer = require('../../lib/models/reviewer');


describe('Reviewer test', () => {
    
    const reviewer = new Reviewer({
        name: 'dirk funk',
        company: 'Dumpster Inc',
        email: 'review@review',
        role: 'rookie' 
    });

    

    it('generates hash from password', ()=> {
        reviewer.generateHash('secret');
        assert.isOk(reviewer.hash);

    });

    it('compares password', () => {
        reviewer.generateHash('secret');
        assert.isTrue(reviewer.comparePassword('secret'));
        assert.isFalse(reviewer.comparePassword('bollocks'));
    });

    it('should validate a good model', () => {

        const validate = reviewer.validateSync();

        assert.equal(validate, undefined);

    });

    it('should return error if no name', () => {
        const badReviewer = new Reviewer({});

        const { errors } = badReviewer.validateSync();
        assert.equal(errors.name.kind, 'required');
    });

    it('should return error if no company', () => {
        const badReviewer = new Reviewer({});

        const { errors } = badReviewer.validateSync();
        assert.equal(errors.company.kind, 'required');
    });

});