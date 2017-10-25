const mongoose = require('mongoose');
const connect = require('../../lib/connect');
const url = 'mongodb://localhost:27017/ripe-banana-test';
const request = require('./request'); // eslint-disable-line

before(() => connect(url));
after(() => mongoose.connection.close());


module.exports = {
    drop() {
        return mongoose.connection.dropDatabase();
    },
    getToken(user = {
        email: 'me@me.com',
        password: 'four'
    })
    {
        return request.post('/api/auth/signup')
            .send(user)
            .then(({ body }) => body.token);
    }
};