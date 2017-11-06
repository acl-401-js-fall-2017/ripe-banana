const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const filmSchema = new Schema({
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
        required: true
    },
    cast: [{
        part: String,
        actor: {
            type: Schema.Types.ObjectId,
            ref: 'Actor',
            required: true
        },
        _id: false
    }]
});

filmSchema.statics.movieCount = function movieCount(){
    let agg = [
        { $unwind: "$cast" },
        { $unwind: "$cast.actor" },
        {$group: { _id: "$cast.actor", tags: { $sum: 1 } }}
    ];
    console.log('AGGREGATING');
    return this.aggregate(agg);
};

module.exports = mongoose.model('Film', filmSchema);
