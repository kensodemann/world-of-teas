'use strict';

const auth = require('../services/authentication');

module.exports = (app) => {
  app.post('/api/login', auth.authenticate.bind(auth));

  app.post('/api/logout', (req, res) => {
    req.logout();
    res.end();
  });
};
