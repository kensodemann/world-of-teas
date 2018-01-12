'use strict';

class DataServiceLogger {
  requests = [];

  reset() {
    this.requests = [];
  }

  log(pathMatch, query, request) {
    this.requests.push({
      url: request.url,
      method: request.method,
      body: request.body
    });
  }
}

export default new DataServiceLogger();
