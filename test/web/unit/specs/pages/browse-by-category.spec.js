import Vue from 'vue';
import VueResource from 'vue-resource';
import VueResourceMock from 'vue-resource-mock';
import Page from '@/components/pages/browse-by-category';

import testDataService from '@/assets/test-data/data-service';
import testTeaCategories from '@/assets/test-data/tea-categories';

Vue.use(VueResource);
Vue.use(VueResourceMock, testDataService);

describe('browse-by-category.vue', () => {
  let vm;
  beforeEach(() => {
    const Constructor = Vue.extend(Page);
    vm = new Constructor().$mount();
  });

  it('should render correct title', () => {
    expect(vm.$el.querySelector('.browse-by-category h1').textContent).to.equal(
      'I Like to Browse by Category'
    );
  });

  it('should fetch the tea categories', () => {
    return Vue.nextTick().then(() => {
      expect(vm.categories).to.deep.equal(testTeaCategories);
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
