'use strict';

const Repository = require('./repository');
const TeasService = require('../services/teas');

module.exports = (app, auth, pool) => {
  const teas = new TeasService(pool);
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
