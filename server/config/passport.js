'use strict';

const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const password = require('../services/password');
const sessions = require('../services/sessions');
const users = require('../services/users');

module.exports = () => {
  passport.use(
    new LocalStrategy(function(username, passwd, done) {
      (async () => {
        const user = await users.get(username);
        if (user && (await password.matches(user.id, passwd))) {
          const sessionId = await sessions.start(user.id);
          done(null, { sessionId: sessionId, ...user });
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
