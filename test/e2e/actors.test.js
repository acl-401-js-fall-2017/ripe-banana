const {assert} = require('chai');
const mongoose = require('mongoose').connection;
const request = require('./request');

describe('actor CRUD', () => {
    let rawData = null;

    beforeEach(() => mongoose.dropDatabase());
});