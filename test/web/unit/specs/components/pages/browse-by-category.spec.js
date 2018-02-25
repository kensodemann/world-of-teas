'use strict';

import Vue from 'vue';

import Page from '@/components/pages/browse-by-category';
import store from '@/store';
import mockHttp from '../../../mock-http';
import util from '../../../util';

describe('browse-by-category.vue', () => {
  let teaCategories;
  beforeEach(() => {
    initializeTestData();
    mockHttp.initialize();
    mockHttp.setResponse('/api/tea-categories', {
      status: 200,
      body: teaCategories
    });
  });

  afterEach(() => {
    mockHttp.restore();
  });

  it('renders the correct title', () => {
    const vm = util.mountComponent(Page);
    expect(
      vm.$el.querySelector('.browse-by-category .page-title').textContent
    ).to.equal('Types of Tea');
  });

  it('renders a title for each category', () => {
    store.commit('teaCategories/load', teaCategories);
    const vm = util.mountComponent(Page);
    const titles = vm.$el.querySelectorAll(
      '.browse-by-category .category-title'
    );
    expect(titles.length).to.equal(teaCategories.length);
    for (let i = 0; i < titles.length; i++) {
      expect(titles[i].textContent).to.equal(vm.categories[i].name);
    }
  });

  it('renders a title for each category if loaded after the page is initially rendered', async () => {
    store.commit('teaCategories/load', []);
    const vm = util.mountComponent(Page);
    let titles = vm.$el.querySelectorAll(
      '.browse-by-category .category-title'
    );
    expect(titles.length).to.equal(0);
    store.commit('teaCategories/load', teaCategories);
    await Vue.nextTick();
    titles = vm.$el.querySelectorAll(
      '.browse-by-category .category-title'
    );
    expect(titles.length).to.equal(teaCategories.length);
  });

  function initializeTestData() {
    teaCategories = [
      {
        id: 1,
        name: 'Green',
        description: 'Non - oxidized, mild tea'
      },
      {
        id: 2,
        name: 'Black',
        description: 'Oxidized tea'
      },
      {
        id: 3,
        name: 'Herbal',
        description: 'Not a tea'
      },
      {
        id: 4,
        name: 'Oolong',
        description: 'Chinese deliciousness'
      }
    ];
  }
});
