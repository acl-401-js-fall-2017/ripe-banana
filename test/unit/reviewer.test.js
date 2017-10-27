const { assert } = require('chai');
const Reviewer = require('../../lib/models/reviewer');


const reviewer = new Reviewer({
    name: 'dirk funk',
    company: 'Dumpster Inc',
    email: 'spider_friend@yahoo.com',
    hash: 'placeholdertext',
    roles: 'goodBoy'
});

describe('Reviewer authentication test', () => {
    const password = 'admin';

    it('should generate random hash from password', () => {
        reviewer.generateHash(password);
        assert.ok(reviewer.hash);
        assert.notEqual(reviewer.hash, password);
    });

    it('hash should match password', () => {
        assert.isTrue(reviewer.comparePassword(password));
        assert.isFalse(reviewer.comparePassword('fakepassword'));
    });

});

describe('Reviewer test', () => { 

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