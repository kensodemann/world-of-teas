'use strict';

import Vue from 'vue';

export default {
  current() {
    return Vue.http.get('/api/users/current').then(res => res.body);
  },

  changePassword(id, currentPassword, newPassword) {
    return Vue.http
      .post(`/api/users/${id}/password`, {
        currentPassword: currentPassword,
        password: newPassword
      })
      .then(res => res.body);
  },

  save(user) {
    const url = '/api/users' + (user.id ? `/${user.id}` : '');
    return Vue.http.post(url, user).then(res => res.body);
  }
};
