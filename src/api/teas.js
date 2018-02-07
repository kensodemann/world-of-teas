'use strict';

import Vue from 'vue';

export default {
  getAll() {
    return Vue.http.get('/api/teas').then(res => res.body);
  },

  save(tea) {
    const url = '/api/teas' + (tea.id ? `/${tea.id}` : '');
    return Vue.http.post(url, tea).then(res => res.body);
  },

  delete(tea) {
    if (!(tea && tea.id)) {
      return Promise.reject(new Error('attempt to delete tea without ID'));
    }

    const url = '/api/teas' + (tea.id ? `/${tea.id}` : '');
    return Vue.http.delete(url).then(res => res.body);
  }
};
