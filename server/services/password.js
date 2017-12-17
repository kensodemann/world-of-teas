'use strict';

const Encryption = require('./encryption');
const moment = require('moment');

module.exports = class Password {
  constructor(pool) {
    this._pool = pool;
    this._encryption = new Encryption();
  }

  async initialize(id, password) {
    const reject =
      this._missingParam(id, 'id') || this._missingParam(password, 'password');
    if (reject) {
      return reject;
    }

    const client = await this._pool.connect();
    const data = await this._getCredentials(client, id);
    if (data) {
      return Promise.reject(new Error('Password already initialized'));
    }

    await this._updateCredentials(client, id, password);

    client.release();
  }

  async change(id, password, currentPassword) {
    const reject =
      this._missingParam(id, 'id') || this._missingParam(password, 'password');
    if (reject) {
      return reject;
    }

    const client = await this._pool.connect();
    if (!await this._passwordMatches(client, id, currentPassword)) {
      return Promise.reject(new Error('Invalid password'));
    }

    await this._updateCredentials(client, id, password);

    client.release();
  }

  async reset(id, password, token) {
    const reject =
      this._missingParam(id, 'id') || this._missingParam(password, 'password');
    if (reject) {
      return reject;
    }

    const client = await this._pool.connect();

    const t = await this._getToken(client, id);
    if (!t || t.token !== token) {
      return Promise.reject(new Error('Invalid password reset token'));
    }
    if (+moment() > (t.timestamp + (30 * 60 * 1000))) {
      return Promise.reject(new Error('Expired password reset token'));
    }

    await this._updateCredentials(client, id, password);

    client.release();
  }

  async matches(id, password) {
    const client = await this._pool.connect();
    const m = this._passwordMatches(client, id, password);
    client.release();
    return m;
  }

  async _passwordMatches(client, id, password) {
    const cred = await this._getCredentials(client, id);
    return !!(cred && cred.password === this._encryption.hash(cred.salt, password));
  }

  async _getCredentials(client, id) {
    const data = await client.query(
      'select * from user_credentials where user_rid = $1',
      [id]
    );
    return data.rows && data.rows[0];
  }

  async _getToken(client, id) {
    const data = await client.query(
      'select * from password_reset_token where user_rid = $1',
      [id]
    );
    return data.rows && data.rows[0];
  }

  _missingParam(p, name) {
    if (!p) {
      return Promise.reject(new Error(`Missing Parameter: ${name}`));
    }
  }

  _updateCredentials(client, id, password) {
    const salt = this._encryption.salt();
    const hash = this._encryption.hash(salt, password);

    return client.query(
      `insert into user_credentials (user_rid, password, salt)
       values ($1, $2, $3)
       on conflict (user_rid) do update
       set password = $2, salt = $3`,
      [id, hash, salt]
    );
  }
};
