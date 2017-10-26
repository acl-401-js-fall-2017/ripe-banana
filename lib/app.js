const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const errorHandler = require('./utils/error-handler');
const ensureAuth = require('./utils/ensure-auth');

const auth = require('./routes/auth');
const studio = require('./routes/studios');
const film = require('./routes/films');
const reviewer = require('./routes/reviewers');
const review = require('./routes/reviews');
const actor = require('./routes/actors');


app.use(bodyParser.json());
app.use('/api/auth', auth);
app.use('/api/studios', studio);
app.use('/api/films', film);
app.use('/api/actors', actor);
app.use('/api/reviewers', reviewer);
app.use('/api/reviews', review);
app.use(errorHandler());

module.exports = app; 
