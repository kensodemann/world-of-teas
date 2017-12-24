'use strict';

const express = require('express');
const path = require('path');
const AuthenticationService = require('../services/authentication');

module.exports = (app, pool) => {
  const auth = new AuthenticationService();

  app.use('/', express.static(path.join(__dirname, '/../../dist')));

  require('../routes/tea-categories')(app, pool);
  require('../routes/users')(app, auth, pool);
};
