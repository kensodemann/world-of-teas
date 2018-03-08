'use strict';

const bodyParser = require('body-parser');
const passport = require('passport');

module.exports = app => {
  app.set('port', process.env.PORT || 5000);

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(function(req, res, next) {
    if (process.env.ALLOW_ORIGIN) {
      res.header('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN);
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    next();
  });

  app.use(passport.initialize());
};
