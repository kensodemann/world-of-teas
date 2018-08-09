'use strict';

import Vue from 'vue';
import store from '@/store';

export function mountComponent(c, props) {
  const propsData = props ? { propsData: { ...props } } : undefined;
  const StoreVue = Vue.extend();
  StoreVue.prototype.$store = store;
  StoreVue.prototype.$route = {};
  const Constructor = StoreVue.extend(c);
  store.dispatch('teaCategories/refresh');
  store.dispatch('teas/refresh');
  return new Constructor(propsData).$mount();
}
