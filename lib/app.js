const express = require('express');
const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');
const ensureAuth = require('./utils/ensure-auth');
const errorHandler = require('./utils/error-handler');

const auth = require('./routes/auth');
const studios = require('./routes/studios');
const actors = require('./routes/actors');
const films = require('./routes/films');
const reviewers = require('./routes/reviewers');
const reviews = require('./routes/reviews');

app.use(morgan('dev'));
app.use(express.static('./public'));
app.use(bodyParser.json());

app.use('/api/auth', auth);
app.use('/api/studios', studios);
app.use('/api/actors', actors);
app.use('/api/films', films);
app.use('/api/reviewers', reviewers);
app.use('/api/reviews', reviews);

app.use(errorHandler());


module.exports = app;