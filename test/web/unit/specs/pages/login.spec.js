import Vue from 'vue';
import Page from '@/components/pages/login';

describe('login.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Page);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.login h1').textContent)
      .to.equal('Login Page is Here');
  });
});
