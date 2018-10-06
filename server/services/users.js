'use strict';

const database = require('../config/database');
const password = require('./password');

const columns = 'id, first_name as "firstName", last_name as "lastName", email';

class Users {
  async getAll() {
    const client = await database.connect();
    const data = await client.query(`select ${columns} from users`);
    client.release();
    return data.rows;
  }

  async get(id) {
    const client = await database.connect();
    const data = await (/.*@.*/.test(id)
      ? client.query(
        `select ${columns} from users where upper(email) = upper($1)`,
        [id]
      )
      : client.query(`select ${columns} from users where id = $1`, [id]));
    client.release();
    const user = data.rows && data.rows[0] ? { ...data.rows[0] } : undefined;
    if (user) {
      user.roles = ['admin', 'user'];
    }
    return user;
  }

  async save(user) {
    const client = await database.connect();
    let rtn;
    if (user.id) {
      rtn = await client.query(
        `update users set first_name = $2, last_name = $3, email = $4 where id = $1 returning ${columns}`,
        [user.id, user.firstName, user.lastName, user.email]
      );
    } else {
      rtn = await client.query(
        `insert into users(first_name, last_name, email) values($1, $2, $3) returning ${columns}`,
        [user.firstName, user.lastName, user.email]
      );
      if (rtn.rows && rtn.rows[0] && rtn.rows[0].id) {
        password.initialize(rtn.rows[0].id, user.password || 'password');
      }
    }
    client.release();
    return rtn.rows && rtn.rows[0];
  }
};

module.exports = new Users();
