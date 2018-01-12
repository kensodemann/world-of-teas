'use strict';

export default {
  login: (state, { token, user }) => {
    state.token = token;
    state.user = user;
    localStorage.setItem('world-of-teas.token', token);
  },

  logout: state => {
    state.token = '';
    state.user = {};
    localStorage.removeItem('world-of-teas.token');
  }
};
