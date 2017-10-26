const assert = require('chai').assert;
const User = require('../../lib/models/user');

describe('user model', () => {

    const user = new User({
        email: 'shane@me.com'
    });

    const password = 'abc';

    it('generates hash from password',() => {
        user.generateHash(password);
        assert.isOk(user.hash);
        assert.notEqual(user.hash, password);
    });

    it.only('compares password', () => {
        assert.isTrue(user.comparePassword('abc'));
        assert.isFalse(user.comparePassword('bad password'));
    });

});

    



