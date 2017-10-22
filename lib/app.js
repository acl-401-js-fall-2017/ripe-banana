const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const studio = require('./routes/studios');
const reviewer = require('./routes/reviewers');


app.use(bodyParser.json());
app.use('/api/studios', studio);
app.use('/api/reviewers', reviewer);

module.exports = app; 
