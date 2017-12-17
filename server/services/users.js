'use strict';

const encryption = require('./encryption');

const columns = 'id, first_name as "firstName", last_name as "lastName", email';

module.exports = class Users {
  constructor(pool) {
    this._pool = pool;
  }

  async getAll() {
    const client = await this._pool.connect();
    const data = await client.query(`select ${columns} from users`);
    client.release();
    return data.rows;
  }

  async get(id) {
    const client = await this._pool.connect();
    const data = await (/.*@.*/.test(id)
      ? client.query(`select ${columns} from users where upper(email) = upper($1)`, [id])
      : client.query(`select ${columns} from users where id = $1`, [id]));
    client.release();
    const user = data.rows && data.rows[0];
    if (user) {
      user.roles = ['admin', 'user'];
    }
    return user;
  }

  async save(user) {
    const client = await this._pool.connect();
    let rtn;
    if (user.id) {
      rtn = await client.query(
        'update users set first_name = $2, last_name = $3, email = $4 where id = $1 returning *',
        [user.id, user.firstName, user.lastName, user.email]
      );
    } else {
      rtn = await client.query(
        'insert into users(first_name, last_name, email) values($1, $2, $3) returning *',
        [user.firstName, user.lastName, user.email]
      );
    }
    client.release();
    return rtn.rows && rtn.rows[0];
  }

  async passwordMatches(id, password) {
    const client = await this._pool.connect();
    const data = await client.query(
      'select * from user_credentials where id = $1',
      [id]
    );
    const cred = data.rows && data.rows[0];
    client.release();
    return !!(cred && cred.password === encryption.hash(cred.salt, password));
  }
};
