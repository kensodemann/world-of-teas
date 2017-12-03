'use strict';

module.exports = class Users {
  constructor(pool) {
    this._pool = pool;
  }

  async getAll() {
    const client = await this._pool.connect();
    const data = await client.query('select * from users');
    client.release();
    return data.rows;
  }

  async get(id) {
    const client = await this._pool.connect();
    const data = await (/.*@.*/.test(id)
      ? client.query('select * from users where email = $1', [id])
      : client.query('select * from users where id = $1', [id]));
    client.release();
    return data.rows && data.rows[0];
  }
};