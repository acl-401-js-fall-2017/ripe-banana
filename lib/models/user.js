const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const RequireString = {
    type: String,
    required: true
};

const userSchema = new Schema({
    email: RequireString,
    hash: RequireString
});

userSchema.methods.generateHash = function(password) {
    this.hash = bcrypt.hashSync(password, 8);
};

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.hash);
};

userSchema.statics.emailExists = function(email) {
    return this.find({ email })
        .count()
        .then(count => count > 0);
};

module.exports = mongoose.model('User', userSchema);