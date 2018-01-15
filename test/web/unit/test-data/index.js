'use strict';

import Vue from 'vue';

class TestData {
  initialize() {
    sinon.stub(Vue.http, 'get');
    sinon.stub(Vue.http, 'post');

    this.setResponse('/api/tea-categories', {
      status: 200,
      body: this.teaCategories
    });
  }

  restore() {
    Vue.http.get.restore();
    Vue.http.post.restore();
  }

  setResponse(endpoint, response) {
    Vue.http.get.withArgs(endpoint).returns(Promise.resolve(response));
  }

  setPostResponse(endpoint, response) {
    Vue.http.post.withArgs(endpoint).returns(Promise.resolve(response));
  }

  teaCategories = [
    {
      id: 1,
      name: 'Green',
      description: 'Non - oxidized, mild tea'
    },
    {
      id: 2,
      name: 'Black',
      description: 'Oxidized tea'
    },
    {
      id: 3,
      name: 'Herbal',
      description: 'Not a tea'
    },
    {
      id: 4,
      name: 'Oolong',
      description: 'Chinese deliciousness'
    }
  ];
}

export default new TestData();
