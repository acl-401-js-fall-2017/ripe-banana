const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('./utils/error-handler');
const ensureAuth = require('./utils/ensureAuth');


const studio = require('./routes/studios');
const film = require('./routes/films');
const reviewer = require('./routes/reviewers');
const review = require('./routes/reviews');
const actor = require('./routes/actors');
const auth = require('./routes/auth');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/api/studios', studio);
app.use('/api/films', film);
app.use('/api/actors', actor);
app.use('/api/reviewers', reviewer);
app.use('/api/reviews', review);
app.use('/api/auth', auth);

app.use(errorHandler());


module.exports = app; 
