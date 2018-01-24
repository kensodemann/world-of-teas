'use strict';

import Vue from 'vue';
import Page from '@/components/pages/home';

describe('home.vue', () => {
  it('has the correct title', () => {
    const Constructor = Vue.extend(Page);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.home .page-title').textContent)
      .to.equal('Find Great Tea');
  });
});
