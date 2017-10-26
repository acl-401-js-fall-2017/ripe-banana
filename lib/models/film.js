const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema ({ 
    
    title:{type: String, required: true},

    studio : {
        type: Schema.Types.ObjectId,
        ref : 'Studio',
        required: true
    },

    released: {type: Number, required: true},
    
    cast: [{
        part: String,
        actor: {
            type: Schema.Types.ObjectId,
            ref: 'Actor',
            required: true
        }
    }]

});

module.exports = mongoose.model('Film', schema); 