const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const requiredString = {
    type: String,
    required: true
};

const userSchema = new Schema({
    name: requiredString,
    company: requiredString,
    email: requiredString,
    hash: requiredString,
    roles: [String]
});

module.exports = mongoose.model('User', userSchema);