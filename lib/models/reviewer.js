
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewerSchema = new Schema ({
    name:{ 
        type: String,
        required: true
    },
    company:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Reviewer', reviewerSchema);


