const assert = require('chai').assert; 
const User = require('../../lib/models/user');


describe('User model', () => {

    const user = new User({
        email: 'bob@user.com'
    });

    const password = 'bob';

    it('Generates hash from password', () => {
        user.generateHash(password);
        assert.isOk(user.hash);
        assert.notEqual(user.hash, password);

    });

    it('Compares password', ()=> {
        assert.isTrue(user.comparePassword('bob'));
        assert.isFalse(user.comparePassword('invalid password'));
    });

});