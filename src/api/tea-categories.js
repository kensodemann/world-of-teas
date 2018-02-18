import Vue from 'vue';

export default {
  async getAll() {
    const res = await Vue.http.get('/api/tea-categories');
    return res.body;
  }
};
