'use strict';

const PasswordService = require('../services/password');
const UsersService = require('../services/users');

module.exports = (app, auth, pool) => {
  const password = new PasswordService(pool);
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

  app.post(
    '/api/users/:id/password',
    auth.requireApiLogin.bind(auth),
    auth.requireRoleOrId('admin').bind(auth),
    (req, res) => {
      (async () => {
        const pwd = req.body;
        try {
          if (!(pwd.password && pwd.currentPassword)) {
            throw new Error('Invalid parameters');
          }

          await password.change(
            req.params.id,
            pwd.password,
            pwd.currentPassword
          );
          res.send();
        } catch (err) {
          const msg = err.toString();
          if (/Error: Invalid/.test(msg)) {
            res.status(400).send({ reason: msg });
          } else {
            res.status(500).send({ reason: 'Unknown error' });
          }
        }
      })().catch(e => console.error(e.stack));
    }
  );

  app.post(
    '/api/users/:id/password/:token',
    (req, res) => {
      (async () => {
        const pwd = req.body;
        try {
          if (!(pwd.password)) {
            throw new Error('Invalid parameters');
          }

          await password.reset(
            req.params.id,
            pwd.password,
            req.params.token
          );
          res.send();
        } catch (err) {
          const msg = err.toString();
          if (/Error: [Invalid|Expired]/.test(msg)) {
            res.status(400).send({ reason: msg });
          } else {
            res.status(500).send({ reason: 'Unknown error' });
          }
        }
      })().catch(e => console.error(e.stack));
    }
  );
};
