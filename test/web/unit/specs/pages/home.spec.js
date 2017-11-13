import Vue from 'vue';
import Page from '@/components/pages/home';

describe('home.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Page);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.home h1').textContent)
      .to.equal('Home is Wherever the Tea Is');
  });
});
