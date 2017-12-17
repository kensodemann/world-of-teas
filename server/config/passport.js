'use strict';

const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const Password = require('../services/password');
const Users = require('../services/users');

module.exports = (pool) => {
  const password = new Password(pool);
  const users = new Users(pool);

  passport.use(
    new LocalStrategy(function(username, passwd, done) {
      (async () => {
        const user = await users.get(username);
        if (user && (await password.matches(user.id, passwd))) {
          done(null, user);
        } else {
          done(null, false);
        }
      })();
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user && user.id);
  });
};
