'use strict';

const PasswordService = require('../services/password');
const Repository = require('./repository');
const UsersService = require('../services/users');

module.exports = (app, auth, pool) => {
  const password = new PasswordService(pool);
  const users = new UsersService(pool);
  const userRepo = new Repository(users);

  app.get(
    '/api/users',
    auth.requireApiLogin.bind(auth),
    auth.requireRole('admin').bind(auth),
    (req, res) => {
      userRepo.getAll(req, res);
    }
  );

  app.get('/api/users/current', auth.requireApiLogin.bind(auth), (req, res) => {
    (async () => {
      const u = auth.verifyToken(req);
      const user = await users.get(u.id);
      if (!user) {
        res.status(404);
        res.end();
      }
      res.send(user);
    })().catch(e => console.error(e.stack));
  });

  app.get(
    '/api/users/:id',
    auth.requireApiLogin.bind(auth),
    auth.requireRoleOrId('admin').bind(auth),
    (req, res) => {
      userRepo.get(req, res);
    }
  );

  app.post(
    '/api/users',
    auth.requireApiLogin.bind(auth),
    auth.requireRole('admin').bind(auth),
    (req, res) => {
      userRepo.insert(req, res);
    }
  );

  app.post(
    '/api/users/:id',
    auth.requireApiLogin.bind(auth),
    auth.requireRoleOrId('admin').bind(auth),
    (req, res) => {
      userRepo.update(req, res);
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
          res.send({ success: true });
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

  app.post('/api/users/:id/password/:token', (req, res) => {
    (async () => {
      const pwd = req.body;
      try {
        if (!pwd.password) {
          throw new Error('Invalid parameters');
        }

        await password.reset(req.params.id, pwd.password, req.params.token);
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
  });
};
