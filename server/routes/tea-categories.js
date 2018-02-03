'use strict';

const Repository = require('./repository');
const TeaCategoriesService = require('../services/tea-categories');

module.exports = (app, pool) => {
  const repository = new Repository(new TeaCategoriesService(pool));

  app.get('/api/tea-categories', (req, res) => {
    repository.getAll(req, res);
  });
};
