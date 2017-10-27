/* eslint-disable*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const requiredString = {
    type: String,
    required: true
};

const schema = new Schema({

    name: requiredString,
    
    company: requiredString,

    email: requiredString,

    role: requiredString,
    
    hash: String,

    password: String

});

schema.methods.generateHash = function(pass) {
    this.hash = bcrypt.hashSync(pass, 7);
};

schema.methods.comparePassword = function(pass) {
    return bcrypt.compareSync(pass, this.hash);
};

schema.statics.hasEmail = async function(email) {

    const exists = await this.find({email}).count();
    return exists > 0;
        
};

module.exports = mongoose.model('Reviewer', schema);