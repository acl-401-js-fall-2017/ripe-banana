const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({

    rating: { type: Number, required: true },

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

    createdAt: Number,
    updatedAt: Number

});


module.exports = mongoose.model('Review', schema);