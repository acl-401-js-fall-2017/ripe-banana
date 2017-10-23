const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());


const studios = require('./routes/studios');
app.use('/api/studios', studios);

const actors = require('./routes/actors');
app.use('/api/actors', actors);

const films = require('./routes/films');
app.use('/api/films', films);

const reviewers = require('./routes/reviewers');
app.use('/api/reviewers', reviewers);

const reviews = require('./routes/reviews');
app.use('/api/reviews', reviews);


const errorHandler = require('./utils/error-handler');
app.use(errorHandler());


module.exports = app;