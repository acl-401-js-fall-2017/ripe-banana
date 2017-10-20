const mongoose = require('mongoose');
const connect = require('../../lib/connect');
const url = 'mongodb://localhost:27017/ripe-banana-test';

before(() => connect(url));
after(() => mongoose.connection.close());
