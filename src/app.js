const express = require('express');
const path = require('path');

const app = express();

//static files
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
