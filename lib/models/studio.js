const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({

    name: {
        type: String,
        required: true
    },
    
    address: {
        city: String,
        state: String,
        country: String
    }

});


module.exports = mongoose.model('Studio', schema);