const mongoose = require('mongoose');
mongoose.Promise = Promise;

const defaultUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/filmIndustry';
// You MUST change the end point of this url for other projects!

module.exports = function(dbUri = defaultUri) {
    const promise = mongoose.connect(dbUri, {useMongoClient: true});

    mongoose.connection.on('connected', function() {
        console.log('Mongoose default connection open to ' + dbUri); //eslint-disable-line
    });

    mongoose.connection.on('error', function(err) {
        console.log('Mongoose default connection error: ', + err); //eslint-disable-line
    });

    mongoose.connection.on('disconnected', function() {
        console.log('Mongoose default connection disconnected'); //eslint-disable-line
    });

    process.on('SIGINT', function() {
        mongoose.connection.close(function() {
            console.log('Mongoose default connection disconnected through app termination'); //eslint-disable-line
            process.exit(0);
        });
    });
    return promise;

};