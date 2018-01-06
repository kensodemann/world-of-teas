'use strict';

import Vue from 'vue';

export default {
  current() {
    return Vue.http.get('/api/users/current').then(res => res.body);
  }
};
