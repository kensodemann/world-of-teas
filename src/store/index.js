'use strict';

import Vue from 'vue';
import Vuex from 'vuex';

import identity from './modules/identity';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    identity
  }
});
