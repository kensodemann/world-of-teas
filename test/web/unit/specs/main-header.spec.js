import Vue from 'vue';
import Component from '@/components/main-header';

describe('main-header.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Component);
    const vm = new Constructor().$mount();
    const links = vm.$el.querySelectorAll('.header a');
    expect(links.length).to.equal(5);
  });
});
