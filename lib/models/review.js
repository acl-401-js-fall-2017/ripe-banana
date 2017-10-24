const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    reviewer: {
        type: Schema.Types.ObjectId,
        ref: 'Reviewer',
        required: true
    },
    reviewText: {
        type: String,
        required: true
    }
    
},{
    timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);