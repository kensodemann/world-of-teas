'use strict';

const {Pool} = require('pg');

module.exports = (app) => {
  const pool = new Pool({connectionString: process.env.DATABASE_URL});

  require('./tea-categories')(app, pool);
};
