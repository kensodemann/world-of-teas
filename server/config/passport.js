'use strict';

const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const users = require('../services/users');

module.exports = () => {
  passport.use(
    new LocalStrategy(function(username, password, done) {
      (async () => {
        const user = await users.get(username);
        if (user && (await users.passwordMatches(user.id, password))) {
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
