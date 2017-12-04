'use strict';

const encryption = require('./encryption');

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
      ? client.query('select * from users where upper(email) = upper($1)', [id])
      : client.query('select * from users where id = $1', [id]));
    client.release();
    return data.rows && data.rows[0];
  }

  async passwordMatches(id, password) {
    const client = await this._pool.connect();
    const data = await client.query('select * from user_credentials where id = $1', [id]);
    const cred = data.rows && data.rows[0];
    client.release();
    return !!(cred && cred.password === encryption.hash(cred.salt, password));
  }
};
