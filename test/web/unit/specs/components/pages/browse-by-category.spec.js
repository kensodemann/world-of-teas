'use strict';

import Vue from 'vue';

import Page from '@/components/pages/browse-by-category';
import testData from '../../../test-data';

describe('browse-by-category.vue', () => {
  let vm;
  beforeEach(() => {
    testData.initialize();
    const Constructor = Vue.extend(Page);
    vm = new Constructor().$mount();
  });

  afterEach(() => {
    testData.restore();
  });

  it('should render correct title', () => {
    expect(vm.$el.querySelector('.browse-by-category h1').textContent).to.equal(
      'I Like to Browse by Category'
    );
  });

  it('should fetch the tea categories', () => {
    return Vue.nextTick().then(() => {
      expect(vm.categories).to.deep.equal(testData.teaCategories);
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
