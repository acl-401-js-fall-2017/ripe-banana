const express = require('express');
const app = express();

const morgan = require('morgan');
// const bodyParser = require('body-parser');
const errorHandler = require('./utils/error-handler');

const studios = require('./routes/studios');
const actors = require('./routes/actors');
const films = require('./routes/films');
const reviewers = require('./routes/reviewers');
const reviews = require('./routes/reviews');
const auth = require('./routes/auth');


app.use(morgan('dev'));
app.use(express.static('./public'));
app.use(express.json());

app.use('/api/studios', studios);
app.use('/api/actors', actors);
app.use('/api/films', films);
app.use('/api/reviewers', reviewers);
app.use('/api/reviews', reviews);

app.use('/api/auth', auth);

app.use(errorHandler());


module.exports = app;