import Vue from 'vue';
import Page from '@/components/pages/browse-by-category';

describe('browse-by-category.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Page);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.browse-by-category h1').textContent)
      .to.equal('I Like to Browse by Category');
  });
});
