"use strict";

const MockClient = require("./mock-client");

module.exports = class MockPool {
  constructor() {
    this._client = new MockClient();
  }

  connect() {
    return Promise.resolve(this._client);
  }
};
