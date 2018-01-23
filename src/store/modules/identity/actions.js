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

  async logout({commit, state}) {
    await authentication.logout();
    commit('logout');
  },

  async refresh({ commit }) {
    const token = localStorage.getItem('world-of-teas.token');
    if (token) {
      commit('login', { token });
      const user = await users.current();
      if (user && user.id) {
        commit('login', { token, user });
      } else {
        commit('logout');
      }
    }
  },

  async save({ commit }, user) {
    const savedUser = await users.save(user);
    commit('user', savedUser);
  }
};
