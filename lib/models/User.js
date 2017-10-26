const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcryptjs');

const reqString = {
    type: String,
    required: true
};

const userSche = new Schema({
    _id: Schema.Types.ObjectId,
    roles: [String],
    hash: Object.assign({
        default: 'hash not yet generated'
    }, reqString),
    email: Object.assign({
        validate: {
            validator: input => /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(input),    // eslint-disable-line
            message: 'invalid email address'
        }
    }, reqString)
}, { _id: false });

userSche.methods.generateHash = function(password) {
    this.hash = bcrypt.hashSync(password, 10);
};

userSche.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.hash);
};

userSche.statics.emailExists = function(email) {
    return this.find({email})
        .count()
        .then(count => {
            count > 0;
        });
};

module.exports = mongoose.model('User', userSche);