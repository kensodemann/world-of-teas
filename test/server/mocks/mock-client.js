'use strict';

module.exports = class MockClient {
  query() {
    return Promise.resolve([]);
  }

  release() {}
};
