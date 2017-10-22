const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const actorSchema = new Schema({
    name: {
        type: String, 
        required: true
    },
    dob: Date,
    pob:  String   
});

module.exports = mongoose.model('Actor', actorSchema );

