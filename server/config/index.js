'use strict';

module.exports = app => {
  require('./passport')();
  require('./express')(app);
  require('./routes')(app);
};
