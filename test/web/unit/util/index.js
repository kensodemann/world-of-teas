'use strict';

import Vue from 'vue';
import store from '@/store';

export async function mountComponent(c, props) {
  const propsData = props ? { propsData: { ...props } } : undefined;
  const StoreVue = Vue.extend();
  StoreVue.prototype.$store = store;
  StoreVue.prototype.$route = {};
  const Constructor = StoreVue.extend(c);
  await store.dispatch('teaCategories/refresh');
  await store.dispatch('teas/refresh');
  return new Constructor(propsData).$mount();
}
