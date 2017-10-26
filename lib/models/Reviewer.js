const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true
};

const schema = new mongoose.Schema({
    name: reqString,
    company: reqString,
});

module.exports = mongoose.model('Reviewer', schema);