const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const studio = require('./routes/studios');
const actor = require('./routes/actors');


app.use(bodyParser.json());
app.use('/api/studios', studio);
app.use('/api/actors', actor);

module.exports = app; 
