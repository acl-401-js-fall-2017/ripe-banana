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

userSchema.methods.generateHash = function(password){
    this.hash = bcrypt.hashSync(password, 8);
};

userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.hash);
};


module.exports = mongoose.model('User', userSchema);