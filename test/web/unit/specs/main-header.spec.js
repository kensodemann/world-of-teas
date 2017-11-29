import Vue from 'vue';
import Component from '@/components/main-header';

describe('main-header.vue', () => {
  it('should render correct contents', () => {
    const vm = mountRoutedComponent();
    const links = vm.$el.querySelectorAll('.header a');
    expect(links.length).to.equal(5);
  });

  function mountRoutedComponent(rte) {
    const route = {
      name: rte
    };
    const RoutedVue = Vue.extend();
    RoutedVue.prototype.$route = route;
    const Constructor = RoutedVue.extend(Component);
    return new Constructor().$mount();
  }
});
