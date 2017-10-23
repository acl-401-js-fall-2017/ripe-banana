const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    reviewer: {
        type: Schema.Types.ObjectId,
        ref: 'Reviewer',
        required: true
    },
    review: {
        type: String,
        required: true,
        maxlength: 140,
    },
    film: {
        type: Schema.Types.ObjectId,
        ref: 'Film',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true
    }
    

});

module.exports = mongoose.model('Review', schema);