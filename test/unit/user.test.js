const assert = require('chai').assert;
const User = require('../../lib/models/user');

describe('user model', () => {
    const user1 = new User({
        email: 'user1@users.com'
    });

    const password = 'abc';

    it('generates hash from password', () => {
        user1.generateHash(password);
        assert.isOk(user1.hash);
        assert.notEqual(user1.hash, password);
    });

    it('compare password', () => {
        assert.isTrue(user1.comparePassword('abc'));
        assert.isFalse(user1.comparePassword('bad password'));
    });
});