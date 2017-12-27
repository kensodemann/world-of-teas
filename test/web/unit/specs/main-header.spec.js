import Vue from 'vue';
import Component from '@/components/main-header';

describe('main-header.vue', () => {
  it('should render the brand', () => {
    const vm = mountRoutedComponent();
    const links = vm.$el.querySelectorAll('b-navbar-brand');
    expect(links.length).to.equal(1);
    expect(links[0].textContent).to.equal('World of Teas');
  });

  it('should render correct links', () => {
    const vm = mountRoutedComponent();
    const links = vm.$el.querySelectorAll('b-nav-item');
    expect(links.length).to.equal(4);
    expect(links[0].textContent).to.equal('Categories');
    expect(links[1].textContent).to.equal('Ratings');
    expect(links[2].textContent).to.equal('Links');
    expect(links[3].textContent).to.equal('Login');
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
