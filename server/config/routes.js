'use strict';

const express = require('express');
const path = require('path');

module.exports = (app) => {
  app.use('/', express.static(path.join(__dirname, '/../../dist')));

  require('../routes/athentication')(app);
  require('../routes/tea-categories')(app);
  require('../routes/teas')(app);
  require('../routes/users')(app);
};
