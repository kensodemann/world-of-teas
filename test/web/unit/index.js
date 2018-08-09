'use strict';

import BootstrapVue from 'bootstrap-vue';
import VeeValidate from 'vee-validate';
import Vue from 'vue';
import VueResource from 'vue-resource';
import VueResourceMock from 'vue-resource-mock';

import MockRouter from './mocks/mock-router';
import testDataService from '@/assets/test-data/data-service';

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(MockRouter);
Vue.use(VeeValidate);
Vue.use(VueResource);
Vue.use(VueResourceMock, testDataService, { silent: true });

// require all test files (files that ends with .spec.js)
const testsContext = require.context('./specs', true, /\.spec$/);
testsContext.keys().forEach(testsContext);

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
const srcContext = require.context(
  '../../../src',
  true,
  /^\.\/(?!(main(\.js)?)|(router\/?.*)|(scss\/.*)?$)/
);
srcContext.keys().forEach(srcContext);
