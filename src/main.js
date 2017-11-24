// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueResource from 'vue-resource';
import VueResourceMock from 'vue-resource-mock';
import App from './App';
import router from './router';

import testDataService from './assets/test-data/data-service';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});

Vue.use(VueResource);

if (process.env.NODE_ENV === 'testing') {
  Vue.use(VueResourceMock, testDataService);
}

console.log('from main: ', process.env.NODE_ENV);
