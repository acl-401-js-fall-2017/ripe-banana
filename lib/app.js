const express = require('express');
const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('./utils/error-handler');

const studios = require('./routes/studios');
const actors = require('./routes/actors');
const films = require('./routes/films');

app.use(morgan('dev'));
app.use(express.static('./public'));
app.use(bodyParser.json());

app.use('/api/studios', studios);

app.use('/api/actors', actors);

app.use('/api/films', films);


app.use(errorHandler());

module.exports = app;