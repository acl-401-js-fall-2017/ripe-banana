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
},{
    timestamps: true
});


reviewSchema.statics.avgRating = function avgRating(){
    const agg = [{ $group : {_id: "$film", avgRating: {$avg : "$rating"}}}];
    console.log('AGGREGATING');
    const agg2 = [{$group : {_id : "$film", num_tutorial : {$avg : "$rating"}}}];
    
    return this.aggregate(agg);
};


module.exports = mongoose.model('Review', reviewSchema);