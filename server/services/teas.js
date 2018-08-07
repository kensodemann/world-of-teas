'use strict';

const columns =
  'teas.id,' +
  'teas.name,' +
  'teas.tea_category_rid as "teaCategoryId",' +
  'tea_categories.name as "teaCategoryName",' +
  'teas.instructions,' +
  'teas.rating';
const tables =
  'teas join tea_categories on tea_categories.id = teas.tea_category_rid';

module.exports = class Teas {
  constructor(pool) {
    this._pool = pool;
  }

  async getAll() {
    const client = await this._pool.connect();
    const qres = await client.query(`select ${columns} from ${tables}`);
    client.release();
    return qres.rows;
  }

  async get(id) {
    const client = await this._pool.connect();
    const qres = await client.query(
      `select ${columns} from ${tables} where teas.id = $1`,
      [id]
    );
    client.release();
    return qres.rows && qres.rows[0];
  }

  async save(tea) {
    let id = tea.id;
    const client = await this._pool.connect();
    if (id) {
      await client.query(
        `update teas set name = $1, tea_category_rid = $2, description = $3, instructions = $4, rating = $5 where id = $6`,
        [
          tea.name,
          tea.teaCategoryId,
          tea.description,
          tea.instructions,
          tea.rating,
          tea.id
        ]
      );
    } else {
      const ins = await client.query(
        'insert into teas (name, tea_category_rid, description, instructions, rating) values ($1, $2, $3, $4, $5) returning id',
        [
          tea.name,
          tea.teaCategoryId,
          tea.description,
          tea.instructions,
          tea.rating
        ]
      );
      id = ins.rows && ins.rows[0].id;
    }
    const qres = await client.query(
      `select ${columns} from ${tables} where teas.id = $1`,
      [id]
    );
    client.release();
    return qres.rows && qres.rows[0];
  }

  async delete(id) {
    const client = await this._pool.connect();
    await client.query(`delete from tea_purchase_links where tea_rid = $1`, [
      id
    ]);
    await client.query(`delete from teas where id = $1`, [id]);
    client.release();
    return {};
  }
};
