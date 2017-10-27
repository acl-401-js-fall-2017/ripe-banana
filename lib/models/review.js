const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({

    rating: { type: Number, required: true, max: 5, min: 0 },

    reviewer: {
        type: Schema.Types.ObjectId,
        ref : 'Reviewer',
        required: true
    },

    review: { type: String, maxlength:140, required: true },

    film: {
        type: Schema.Types.ObjectId,
        ref : 'Film',
        required: true
    },

    createdAt: Date,
    updatedAt: Number

});

module.exports = mongoose.model('Review', schema);