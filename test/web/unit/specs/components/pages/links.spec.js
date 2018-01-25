'use strict';

import Vue from 'vue';
import Page from '@/components/pages/links';

describe('links.vue', () => {
  it('renders the correct title', () => {
    const Constructor = Vue.extend(Page);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.links .page-title').textContent)
      .to.equal('Tea Related Information');
  });
});
