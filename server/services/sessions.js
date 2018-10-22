const database = require('../config/database');

class Sessions {
  async start(userId) {
    if (!userId) {
      return this._missingParam('userId');
    }
    const client = await database.connect();
    const sessionId = await this._getSessionId(client);
    await client.query(
      'insert into user_sessions(session_id, user_rid) values ($1, $2)',
      [sessionId, userId]
    );
    client.release();
    return sessionId;
  }

  async end(sessionId) {
    const client = await database.connect();
    client.query('delete from user_sessions where session_id = $1', [
      sessionId
    ]);
    client.release();
  }

  async verify(userId, sessionId) {
    const client = await database.connect();
    const res = await client.query(
      'select * from user_sessions where session_id = $1 and user_rid = $2',
      [sessionId, userId]
    );
    client.release();
    return res && res.rows.length > 0;
  }

  async _getSessionId(client) {
    const res = await client.query(
      `select nextval('user_session_sequence') as id`
    );
    return res && res.rows[0].id;
  }
  _missingParam(name) {
    return Promise.reject(new Error(`Missing Parameter: ${name}`));
  }
}

module.exports = new Sessions();
