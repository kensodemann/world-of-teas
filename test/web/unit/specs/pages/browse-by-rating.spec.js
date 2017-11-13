import Vue from 'vue';
import Page from '@/components/pages/browse-by-rating';

describe('browse-by-rating.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Page);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.browse-by-rating h1').textContent)
      .to.equal('I Like to Browse by Rating');
  });
});
