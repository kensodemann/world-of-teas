import Vue from 'vue';
import Component from '@/components/main-footer';

describe('main-footer.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Component);
    const vm = new Constructor().$mount();
    expect(vm.$el.textContent).to.equal('This is the footer');
  });
});
