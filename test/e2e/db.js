const connect = require('../../lib/connect');
const url = 'mongodb://localhost:27017/theatre-test';
const mongoose = require('mongoose');
const request = require('./request');

before(() => connect(url));    
after(() => mongoose.connection.close());

module.exports = {
    drop() {
        return mongoose.connection.dropDatabase();
    },
    geToken(user = { email: 'bob@user.com', password: 'abc'}) {
        return request 
            .post('/api/auth/signup')
            .send(user)
            .then(({ body }) => body.token);      
    }
};