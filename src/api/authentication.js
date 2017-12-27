import Vue from 'vue';

export default {
  login(username, password) {
    return Vue.http.post('/api/login', {username: username, password: password}).then(res => res.body);
  }
};
