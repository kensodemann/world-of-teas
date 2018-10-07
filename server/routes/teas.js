'use strict';

const auth = require('../services/authentication');
const Repository = require('./repository');
const teas = require('../services/teas');

module.exports = app => {
  const repository = new Repository(teas);

  app.get('/api/teas', (req, res) => {
    repository.getAll(req, res);
  });

  app.get('/api/teas/:id', (req, res) => {
    repository.get(req, res);
  });

  app.post('/api/teas/:id', auth.requireApiLogin.bind(auth), (req, res) => {
    repository.update(req, res);
  });

  app.post('/api/teas', auth.requireApiLogin.bind(auth), (req, res) => {
    repository.insert(req, res);
  });

  app.delete('/api/teas/:id', auth.requireApiLogin.bind(auth), (req, res) => {
    repository.delete(req, res);
  });
};
