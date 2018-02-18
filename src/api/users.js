import Vue from 'vue';

export default {
  async current() {
    const res = await Vue.http.get('/api/users/current');
    return res.body;
  },

  async changePassword(id, currentPassword, newPassword) {
    const res = await Vue.http.post(`/api/users/${id}/password`, {
      currentPassword: currentPassword,
      password: newPassword
    });
    return res.body;
  },

  async save(user) {
    const url = '/api/users' + (user.id ? `/${user.id}` : '');
    const res = await Vue.http.post(url, user);
    return res.body;
  }
};
