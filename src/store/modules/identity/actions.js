'use strict';

import authentication from '../../../api/authentication';
import users from '../../../api/users';

export default {
  async login({ commit }, { username, password }) {
    const res = await authentication.login(username, password);
    if (res.success) {
      commit('login', res);
    }
    return res;
  },

  logout({ commit, state }) {},

  async refresh({ commit }) {
    const token = localStorage.getItem('world-of-teas.token');
    if (token) {
      commit('login', {token});
      const user = await users.current();
      if (user && user.id) {
        commit('login', { token, user });
      } else {
        commit('logout');
      }
    }
  }
};
