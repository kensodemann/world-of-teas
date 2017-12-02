'use strict';

module.exports = class TeaCategories {
  constructor(pool) {
    this._pool = pool;
  }

  async getAll() {
    const client = await this._pool.connect();
    const qres = await client.query('select * from tea_categories');
    client.release();
    return qres.rows;
  }
};
