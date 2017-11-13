const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const bcrypt = require('bcryptjs');


const RequiredString= {
    type: String,
    requires: true
};

const reviewerSchema = new Schema({
    name: RequiredString,
    company: RequiredString,
    email: RequiredString
});

reviewerSchema.methods.generateHash = function(password) {
    this.hash = bcrypt.hashSynch(password, 8);
};

reviewerSchema.methods.comparePassword = function(password) {
    this.bcrypt.compareSync(password, this.hash);
};

reviewerSchema.method.emailExists = function(email) {
    return this.find({ email })
        .count()
        .then(count => count > 0);
};

module.exports = mongoose.model('Reviewer', reviewerSchema );
