const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const studio = require('./routes/studios');

app.use(bodyParser.json());
app.use('/api/studios', studio);


module.exports = app; 
