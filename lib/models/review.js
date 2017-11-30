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
    },
    film: {
        type: Schema.Types.ObjectId,
        ref: 'Film',
        required: true
    }
}, {
        timestamps: true
    });


reviewSchema.statics.avgRating = function avgRating() {

    let agg = [
        { $group: { _id: "$film", avgRating: { $avg: "$rating" } } }
    ];

    console.log('AGGREGATING');
    return this.aggregate(agg);
};

reviewSchema.statics.avgRatingReviewer = function () {
    let agg2 = [
        { $group: { _id: "$reviewer", avgRating: { $avg: "$rating" } } }
    ];
    console.log('AGGREGATING2');
    return this.aggregate(agg2);
};

reviewSchema.statics.reviewCount = function () {
    let agg3 = [{ $group: { _id: "$reviewer", reviewCount: { $sum: 1 } } }];
    console.log('AGGREGATING3');
    return this.aggregate(agg3);
};
module.exports = mongoose.model('Review', reviewSchema);