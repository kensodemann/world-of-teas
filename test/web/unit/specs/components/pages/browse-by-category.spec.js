'use strict';

import Vue from 'vue';

import Page from '@/components/pages/browse-by-category';
import mockHttp from '../../../mock-http';

describe('browse-by-category.vue', () => {
  let teaCategories;
  let vm;
  beforeEach(() => {
    mockHttp.initialize();
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
    mockHttp.setResponse('/api/tea-categories', {
      status: 200,
      body: teaCategories
    });
    const Constructor = Vue.extend(Page);
    vm = new Constructor().$mount();
  });

  afterEach(() => {
    mockHttp.restore();
  });

  it('renders the correct title', () => {
    expect(vm.$el.querySelector('.browse-by-category .page-title').textContent).to.equal(
      'Types of Tea'
    );
  });

  it('should fetch the tea categories', () => {
    return Vue.nextTick().then(() => {
      expect(vm.categories).to.deep.equal(teaCategories);
    });
  });

  it('should render a title for each category', () => {
    return Vue.nextTick().then(() => {
      return Vue.nextTick().then(() => {
        const titles = vm.$el.querySelectorAll(
          '.browse-by-category .category-title'
        );
        expect(titles.length).to.equal(vm.categories.length);
        for (let i = 0; i < titles.length; i++) {
          expect(titles[i].textContent).to.equal(vm.categories[i].name);
        }
      });
    });
  });
});
