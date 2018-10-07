'use strict';

const auth = require('../services/authentication');
const Repository = require('./repository');
const teaCategories = require('../services/tea-categories');

module.exports = app => {
  const repository = new Repository(teaCategories);

  app.get('/api/tea-categories', (req, res) => {
    repository.getAll(req, res);
  });

  app.get(
    '/api/protected/tea-categories',
    auth.requireApiLogin.bind(auth),
    (req, res) => {
      repository.getAll(req, res);
    }
  );
};
