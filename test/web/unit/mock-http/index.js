'use strict';

import Vue from 'vue';

class MockHttp {
  initialize() {
    sinon.stub(Vue.http, 'get');
    sinon.stub(Vue.http, 'post');
    sinon.stub(Vue.http, 'delete');
  }

  restore() {
    Vue.http.get.restore();
    Vue.http.post.restore();
    Vue.http.delete.restore();
  }

  setResponse(endpoint, response) {
    this._setResponse(Vue.http.get, endpoint, response);
  }

  setDeleteResponse(endpoint, response) {
    this._setResponse(Vue.http.delete, endpoint, response);
  }

  setPostResponse(endpoint, response) {
    this._setResponse(Vue.http.post, endpoint, response);
  }

  _setResponse(verb, endpoint, response) {
    verb.withArgs(endpoint)
      .returns(
      response.status >= 400
        ? Promise.reject(response)
        : Promise.resolve(response)
      );
  }
}

export default new MockHttp();
