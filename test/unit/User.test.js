const {assert} = require('chai');
const User = require('../../lib/models/User');

describe('User model:', () => {

    let noobData = null;
    let bawssData = null;
    beforeEach(() => {
        noobData = {
            email: 'nub@nub.edu'
        };
        bawssData = {
            email: 'the@boss.org',
            roles: ['admin']
        };
    });

    it('creates a user with an email', async() => {
        const noob = new User(noobData);
        const bawss = new User(bawssData);
        assert.isOk(noob.email && bawss.roles);
    });
});