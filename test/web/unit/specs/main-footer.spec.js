import Vue from 'vue';
import Component from '@/components/main-footer';

describe('main-footer.vue', () => {
  it('should render the title line correctly', () => {
    const Constructor = Vue.extend(Component);
    const vm = new Constructor().$mount();
    const text = vm.$el.querySelector('.footer-title').textContent;
    expect(text).to.equal('World of Teas');
  });

  it('should render the copyright line correctly', () => {
    const Constructor = Vue.extend(Component);
    const vm = new Constructor().$mount();
    const text = vm.$el.querySelector('.footer-copyright').textContent;
    expect(text).to.equal('Copyright © 2017 - Kenneth W. Sodemann');
  });
});
