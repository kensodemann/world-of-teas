'use strict';

const TeaCategoriesService = require('../services/tea-categories');

module.exports = (app, pool) => {
  const teaCategories = new TeaCategoriesService(pool);

  app.get('/api/tea-categories', (req, res) => {
    (async () => {
      const data = await teaCategories.getAll();
      res.send(data);
    })().catch(e => console.log(e.stack));
  });
};
