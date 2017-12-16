'use strict';

const app = require('express')();
require('./config')(app);

module.exports = app;
