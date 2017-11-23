'use strict';

const MockClient = require('./mock-client');

module.exports = class MockPool {
  constructor() {
    this.test_client = new MockClient();
  }

  connect() {
    return Promise.resolve(this.test_client);
  }
};
