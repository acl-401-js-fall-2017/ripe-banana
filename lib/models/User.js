const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const RequiredString = {
    type: String,
    required: true
};

const schema = new Schema({
    email: RequiredString,
    password: RequiredString
});

module.exports = mongoose.model('User', schema);