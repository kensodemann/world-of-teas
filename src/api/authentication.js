import Vue from 'vue';

export default {
  async login(username, password) {
    const res = await Vue.http.post('/api/login', {
      username: username,
      password: password
    });
    return res.body;
  },

  async logout() {
    const res = await Vue.http.post('/api/logout');
    return res.body;
  }
};
