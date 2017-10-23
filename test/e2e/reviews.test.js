const { assert } = require('chai');
const mongoose = require('mongoose');
const request = require('./request');

describe('Reviewers API', () => {

    beforeEach(() => {
        mongoose.connection.dropDatabase();
    });


});