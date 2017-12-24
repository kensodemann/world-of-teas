'use strict';

module.exports = app => {
  const pool = require('./database')();

  require('./passport')(pool);
  require('./express')(app);
  require('./routes')(app, pool);
};
