'use strict';

import Vue from 'vue';

export default {
  login(username, password) {
    return Vue.http
      .post('/api/login', { username: username, password: password })
      .then(res => res.body);
  },

  logout() {
    return Vue.http.post('/api/logout').then(res => res.body);
  }
};
