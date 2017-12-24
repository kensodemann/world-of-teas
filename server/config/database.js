'use strict';

const { Pool } = require('pg');

module.exports = () => {
  return new Pool({ connectionString: process.env.DATABASE_URL });
};
