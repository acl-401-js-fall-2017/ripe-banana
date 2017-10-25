/* eslint no-console: "off" */

const mongoose = require('mongoose');
mongoose.Promise = Promise;

const defaultUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ripe-banana';

module.exports = function(dbUri = defaultUri) {
    const promise = mongoose.connect(dbUri, { useMongoClient: true });

    mongoose.connection.on('connected', () => {
        console.log('Mongoose default open to: ' + dbUri);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose default disconnected: ' + dbUri);
    });

    mongoose.connection.on('error', err => {
        console.log('Mongoose default connection error: ' + err);
    });

    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.log('Mongoose default disconnected through app termination');
            process.exit(0);
        });
    });
    
    return promise;
};