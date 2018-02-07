'use strict';

import Vue from 'vue';

class MockHttp {
  initialize() {
    sinon.stub(Vue.http, 'get');
    sinon.stub(Vue.http, 'post');
  }

  restore() {
    Vue.http.get.restore();
    Vue.http.post.restore();
  }

  setResponse(endpoint, response) {
    Vue.http.get
      .withArgs(endpoint)
      .returns(
        response.status >= 400
          ? Promise.reject(response)
          : Promise.resolve(response)
      );
  }

  setPostResponse(endpoint, response) {
    if (response.status && response.status >= 400) {
      Vue.http.post.withArgs(endpoint).returns(Promise.reject(response));
    } else {
      Vue.http.post.withArgs(endpoint).returns(Promise.resolve(response));
    }
  }
}

export default new MockHttp();
