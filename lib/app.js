const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const studio = require('./routes/studios');
const film = require('./routes/films');
const reviewer = require('./routes/reviewers');
const review = require('./routes/reviews');
const actor = require('./routes/actors');

app.use(bodyParser.json());

app.use('/api/studios', studio);
app.use('/api/films', film);
app.use('/api/actors', actor);
app.use('/api/reviewers', reviewer);
app.use('/api/reviews', review);

module.exports = app; 
