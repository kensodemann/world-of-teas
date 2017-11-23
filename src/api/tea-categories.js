import Vue from 'vue';

export default {
  getAll() {
    return Vue.http.get('/api/tea-categories').then(res => res.body);
  }
};
