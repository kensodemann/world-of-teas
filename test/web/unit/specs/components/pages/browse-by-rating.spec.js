'use strict';

import Vue from 'vue';
import Page from '@/components/pages/browse-by-rating';

describe('browse-by-rating.vue', () => {
  it('renders the correct title', () => {
    const Constructor = Vue.extend(Page);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.browse-by-rating .page-title').textContent)
      .to.equal('Teas by Rating');
  });
});
