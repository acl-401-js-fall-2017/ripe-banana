const mongoose = require('mongoose');

mongoose.Promise = Promise;

const defaultUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/theatre';

module.exports = function(dbUri = defaultUri) {
    
    const promise = mongoose.connect(dbUri,  { useMongoClient: true });
    
    
    mongoose.connection.on('connected', function () {  
        console.log('Mongoose default connection open to ' + dbUri);
    });
    
    
    mongoose.connection.on('error',function (err) {  
        console.log('Mongoose default connection error: ' + err);
    }); 
    
   
    mongoose.connection.on('disconnected', function () {  
        console.log('Mongoose default connection disconnected'); 
    });
    
     
    process.on('SIGINT', function() {  
        mongoose.connection.close(function () { 
            console.log( 'Mongoose default connection disconnected through app termination' ); 
            process.exit(0); 
        }); 
    });

    return promise;
};