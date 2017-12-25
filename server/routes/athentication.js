'use strict';

module.exports = (app, auth) => {
  app.post('/api/login', auth.authenticate.bind(auth));

  app.post('/api/logout', (req, res) => {
    req.logout();
    res.end();
  });
};
