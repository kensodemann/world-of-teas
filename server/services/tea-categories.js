'use strict';

const database = require('../config/database');

class TeaCategories {
  async getAll() {
    const client = await database.connect();
    const qres = await client.query('select * from tea_categories');
    client.release();
    return qres.rows;
  }
};

module.exports = new TeaCategories();
