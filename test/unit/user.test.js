const assert = require('chai').assert;
const User = require('../../lib/models/user');

describe('user model', () => {

    it.only('Validates a good user model', () => {
        const user = new User({
            name: 'Shane Moyo',
            company: 'Moyo reviews',
            email: 'Shane@me.com',
            hash: 'Proxy Hash',
            roles: ['user']
        });
        assert.equal(user.validateSync(), undefined);
    });

    it('checks for required fields', ()=> {
        const user = new User({});
        const { errors } = user.validateSync(); 
        assert.equal(errors.name.kind, 'required');
    });

    const user = new User({
        email: 'shane@me.com'
    });

    const password = 'abc';

    it('generates hash from password',() => {
        user.generateHash(password);
        assert.isOk(user.hash);
        assert.notEqual(user.hash, password);
    });

    it('compares password', () => {
        user.generateHash(password);
        assert.isTrue(user.comparePassword('abc'));
        assert.isFalse(user.comparePassword('bad password'));
    });

});

    



