const connect = require('../../lib/connect');
const url = 'mongodb://localhost:27017/theatre-test';
const mongoose = require('mongoose');
const request = require('./request'); // eslint-disable-line

before(() => connect(url));    
after(() => mongoose.connection.close());

module.exports = {
    drop () {
        return mongoose.connection.dropDatabase();
    }

    // getToken(Reviewer = {
    //     email: 'user@gmail.com',
    //     password: 'secret'
    // })

    // {
    //     return request.post('/api/auth/signup')
    //         .send(Reviewer)
    //         .then(({ body }) => body.token);
    // }
};