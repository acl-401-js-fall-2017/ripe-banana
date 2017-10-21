const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const studio = require('./routes/studios');
const film = require('./routes/films');

app.use(bodyParser.json());
app.use('/api/studios', studio);
app.use('/api/films', film);


module.exports = app; 
