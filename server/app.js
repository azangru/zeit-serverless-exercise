const express = require('express');
const app = express();

const getOne = require('../api/document');
const search = require('../api/search');

app.use('/api/document', getOne);
app.use('/api/search', search);

module.exports = app;
