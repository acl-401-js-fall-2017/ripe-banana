const { assert } = require('chai');
const Reviewer = require('../../lib/models/Reviewer');

describe('Reviewer Auth Model', () => {
    const reviewer = new Reviewer({
        email: 'reviewMe@email.com'
    });
    const password = 'birthday';

    it('generates hash from password', () => {
        reviewer.generateHash(password);
        assert.isOk(reviewer.hash);
        assert.notEqual(reviewer.hash, password);
    });

    it('compares passwords', () => {
        assert.isTrue(reviewer.comparePassword('birthday'));
        assert.isFalse(reviewer.comparePassword('1234'));
    });
});