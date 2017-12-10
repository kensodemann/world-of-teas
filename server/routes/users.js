'use strict';

const UsersService = require('../services/users');

module.exports = (app, auth, pool) => {
  const users = new UsersService(pool);

  app.get(
    '/api/users',
    auth.requireApiLogin.bind(auth),
    auth.requireRole('admin').bind(auth),
    (req, res) => {
      (async () => {
        const data = await users.getAll();
        res.send(data);
      })().catch(e => console.error(e.stack));
    }
  );

  app.get(
    '/api/users/:id',
    auth.requireApiLogin.bind(auth),
    auth.requireRoleOrId('admin').bind(auth),
    (req, res) => {
      (async () => {
        const data = await users.get(req.params.id);
        if (!data) {
          res.status(404);
          res.end();
        }
        res.send(data);
      })().catch(e => console.error(e.stack));
    }
  );

  app.post(
    '/api/users',
    auth.requireApiLogin.bind(auth),
    auth.requireRole('admin').bind(auth),
    (req, res) => {
      (async () => {
        let user = Object.assign({}, req.body);
        delete user.id;
        const data = await users.save(user);
        res.send(data);
      })().catch(e => console.error(e.stack));
    }
  );

  app.post(
    '/api/users/:id',
    auth.requireApiLogin.bind(auth),
    auth.requireRoleOrId('admin').bind(auth),
    (req, res) => {
      (async () => {
        const user = Object.assign({}, req.body, {
          id: parseInt(req.params.id)
        });
        const data = await users.save(user);
        if (!data) {
          res.status(404);
          res.end();
        }
        res.send(data);
      })().catch(e => console.error(e.stack));
    }
  );
};
