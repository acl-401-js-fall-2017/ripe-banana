const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    studio: {
        type: Schema.Types.ObjectId,
        ref: 'Studio',
        required: true
    },
    released: {
        type: Number,
        required: true,
        validate: {
            validator: num => {
                return /^\d{4}$/.test(num);
            },
            message: 'not a 4 digit year'
        } 
    },
    cast: [
        {
            part: String,
            actor: {
                type: Schema.Types.ObjectId,
                ref: 'Actor',
                required: true
            }
        }
    ]
});

module.exports = mongoose.model('Film', schema);