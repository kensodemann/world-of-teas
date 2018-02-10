'use strict';

const columns = 'id, tea_rid as "teaId", url, price';

module.exports = class Teas {
  constructor(pool) {
    this._pool = pool;
  }

  async getAll(teaId) {
    const client = await this._pool.connect();
    const qres = await client.query(`select ${columns} from tea_purchase_links where tea_rid = $1`, [teaId]);
    client.release();
    return qres.rows;
  }

  async save(link) {
    let id = link.id;
    const client = await this._pool.connect();
    if (id) {
      await client.query(
        `update tea_purchase_links set tea_rid = $1, url = $2, price = $3  where id = $4`,
        [
          link.teaId,
          link.url,
          link.price,
          link.id
        ]
      );
    } else {
      const ins = await client.query('insert into tea_purchase_links (tea_rid, url, price) values ($1, $2, $3) returning id');
      id = ins.rows && ins.rows[0].id;
    }
    const qres = await client.query(
      `select ${columns} from tea_purchase_links where id = $1`,
      [id]
    );
    client.release();
    return qres.rows && qres.rows[0];
  }

  async delete(id) {
    const client = await this._pool.connect();
    await client.query(`delete from tea_purchase_links where id = $1`, [id]);
    client.release();
    return {};
  }
};
