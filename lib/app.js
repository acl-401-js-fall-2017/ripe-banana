const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('./utils/error-handler');

app.use(morgan('dev'));
app.use(express.static('./public'));
app.use(bodyParser.json());

const studios = require('./routes/studios');
app.use('/api/studios', studios);

const actors = require('./routes/actors');
app.use('/api/actors', actors);

const reviewers = require('./routes/reviewers');
app.use('/api/reviewers', reviewers);


app.use(errorHandler());

module.exports = app;