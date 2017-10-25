const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
// const errorHandler = require('./utils/error-handler');

app.use(morgan('dev'));
app.use(express.static('./public'));
app.use(bodyParser.json());

const actors = require('./routes/actors');
app.use('/api/filmIndustry/actors', actors);

const reviewers = require('./routes/reviewers');
app.use('/api/filmIndustry/reviewers', reviewers);

module.exports = app;
