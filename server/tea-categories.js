'use strict';

const pg = require('pg');

module.exports = (app, pool) => {
  app.get('/api/tea-categories', (req, res) => {
    (async () => {
      const client = await pool.connect();
      try {
        const qres = await client.query('select * from tea_categories');
        res.send(qres.rows);
      } finally {
        client.release();
      }
    })().catch(e => console.log(e.stack));
  });
}
