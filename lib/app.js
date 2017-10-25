const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
// const errorHandler = require('./utils/error-handler');

app.use(morgan('dev'));
app.use(express.static('./public'));
app.use(bodyParser.json());

const actors = require('./routes/actors');


// const films = require('./routes/films');

app.use('/api/filmIndustry/actors', actors);
// app.use('/api/filmIndustry/films', films);

const studios = require('./routes/studios');


app.use('/api/filmIndustry/studios', studios);


const reviewers = require('./routes/reviewers');
app.use('/api/filmIndustry/reviewers', reviewers);

module.exports = app;
