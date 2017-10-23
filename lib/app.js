const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const studio = require('./routes/studios');

const film = require('./routes/films');



app.use('/api/films', film);

const reviewer = require('./routes/reviewers');
const review = require('./routes/reviews');
const actor = require('./routes/actors');



app.use(bodyParser.json());
app.use('/api/studios', studio);
app.use('/api/reviews', review);
app.use('/api/reviewers', reviewer);
app.use('/api/actors', actor);



module.exports = app; 
