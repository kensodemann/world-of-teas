module.exports = class Repository {
  constructor(service) {
    this._service = service;
  }

  async delete(req, res) {
    try {
      res.send(await this._service.delete(parseInt(req.params.id)));
    } catch (e) {
      console.error(e.stack);
    }
  }

  async getAll(req, res) {
    try {
      res.send(await this._service.getAll());
    } catch (e) {
      console.error(e.stack);
    }
  }

  async get(req, res) {
    try {
      const data = await this._service.get(req.params.id);
      if (!data) {
        res.status(404);
        res.end();
      }
      res.send(data);
    } catch (e) {
      console.error(e.stack);
    }
  }

  async insert(req, res) {
    try {
      let item = { ...req.body };
      delete item.id;
      const data = await this._service.save(item);
      res.send(data);
    } catch (e) {
      console.error(e.stack);
    }
  }

  async update(req, res) {
    try {
      const item = { ...req.body, ...{ id: parseInt(req.params.id) } };
      const data = await this._service.save(item);
      if (!data) {
        res.status(404);
        res.end();
      }
      res.send(data);
    } catch (e) {
      console.error(e.stack);
    }
  }
};
