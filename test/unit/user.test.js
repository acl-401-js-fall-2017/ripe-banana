const assert = require('chai').assert;
const User = require('../../lib/models/user');

describe( 'user model validation', () => {
    const user = new User({
        email: 'me@me.com'
    });
    const password = 'hello';

    it('generates hash from user password', () => {
        user.generateHash(password);
        assert.ok(user.hash);
        assert.notEqual(user.hash, password);
    });

    it('compares user password', () => {
        assert.isTrue(user.comparePassword('hello'));
        assert.isFalse(user.comparePassword('bad'));
    });
});