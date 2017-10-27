const assert = require('chai').assert;
const User = require('../../lib/models/user');

describe('user model', () => {

    const password = 'abc';
    let user;
    beforeEach(()=>{
        user = new User({
            name: 'Shane Moyo',
            company: 'Moyo reviews',
            email: 'Shane@me.com',
            hash: 'Proxy Hash',
            roles: ['user']
        });
    });


    it('Validates a good user model', () => {
        assert.equal(user.validateSync(), undefined);
    });

    it('checks for required fields', ()=> {
        user = new User({});
        const { errors } = user.validateSync(); 
        assert.equal(errors.name.kind, 'required');
        assert.equal(errors.company.kind, 'required');
        assert.equal(errors.email.kind, 'required');
        assert.equal(errors.hash.kind, 'required');
    });
    
    
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

    



