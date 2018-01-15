// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import BootstrapVue from 'bootstrap-vue';
import VeeValidate from 'vee-validate';
import Vue from 'vue';
import VueResource from 'vue-resource';
import VueResourceMock from 'vue-resource-mock';

import App from './App';
import router from './router';
import store from './store';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import testDataService from './assets/test-data/data-service';

Vue.use(BootstrapVue);
Vue.use(VeeValidate);

Vue.use(VueResource);
if (process.env.NODE_ENV === 'testing') {
  Vue.use(VueResourceMock, testDataService);
}

Vue.http.interceptors.push(function(req, next) {
  if (store.state && store.state.identity && store.state.identity.token) {
    req.headers.set('Authorization', `Bearer ${store.state.identity.token}`);
  }
  next();
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
