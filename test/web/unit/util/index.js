'use strict';

import Vue from 'vue';
import store from '@/store';

export default {
  mountComponent(c) {
    const StoreVue = Vue.extend();
    StoreVue.prototype.$store = store;
    const Constructor = StoreVue.extend(c);
    return new Constructor().$mount();
  }
}
