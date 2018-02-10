'use strict';

const Repository = require('./repository');
const TeaPurchaseLinksService = require('../services/tea-purchase-links');

module.exports = (app, auth, pool) => {
  const links = new TeaPurchaseLinksService(pool);
  const repository = new Repository(links);

  app.get('/api/teas/:teaId/links', (req, res) => {
    (async () => {
      try {
        res.send(await links.getAll(req.params.teaId));
      } catch (e) {
        console.error(e.stack);
      }
    })();
  });

  app.post(
    '/api/teas/:teaId/links/:id',
    auth.requireApiLogin.bind(auth),
    (req, res) => {
      repository.update(req, res);
    }
  );

  app.delete(
    '/api/teas/:teaId/links/:id',
    auth.requireApiLogin.bind(auth),
    (req, res) => {
      repository.delete(req, res);
    }
  );
};
