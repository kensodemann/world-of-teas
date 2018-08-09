'use strict';

import Vue from 'vue';

import Page from '@/components/pages/browse-by-category';
import store from '@/store';
import teaCategories from '@/assets/test-data/tea-categories';

import { mountComponent } from '../../../util';

describe('browse-by-category.vue', () => {
  let vm;
  beforeEach(async () => {
    vm = mountComponent(Page);
    await Vue.nextTick(); // complete the dispatch then re-render
    await Vue.nextTick();
  });

  it('renders a card for each category', async () => {
    const cards = vm.$el.querySelectorAll('.page .card');
    expect(cards.length).to.equal(teaCategories.length);
    for (let i = 0; i < cards.length; i++) {
      const title = cards[i].querySelector('.card-title');
      expect(title.textContent).to.equal(vm.categories[i].name);
    }
  });

  it('renders a card for each category if loaded after the page is initially rendered', async () => {
    store.commit('teaCategories/load', []);
    await Vue.nextTick();
    let cards = vm.$el.querySelectorAll('.page .card');
    expect(cards.length).to.equal(0);
    store.commit('teaCategories/load', teaCategories);
    await Vue.nextTick();
    cards = vm.$el.querySelectorAll('.page .card');
    expect(cards.length).to.equal(teaCategories.length);
    for (let i = 0; i < cards.length; i++) {
      const title = cards[i].querySelector('.card-title');
      expect(title.textContent).to.equal(vm.categories[i].name);
    }
  });
});
