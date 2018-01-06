'use strict';

import Vue from 'vue';
import Page from '@/components/pages/links';

describe('links.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Page);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.links h1').textContent)
      .to.equal('Welcome to Your Vue.js App');
  });
});
