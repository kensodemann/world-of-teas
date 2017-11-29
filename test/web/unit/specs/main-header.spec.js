import Vue from 'vue';
import Component from '@/components/main-header';

describe('main-header.vue', () => {
  it('should render correct nav links', () => {
    const vm = mountRoutedComponent();
    const links = vm.$el.querySelectorAll('.header .nav-items a');
    expect(links.length).to.equal(4);
    expect(links[0].textContent).to.equal('Home');
    expect(links[1].textContent).to.equal('Categories');
    expect(links[2].textContent).to.equal('Ratings');
    expect(links[3].textContent).to.equal('Links');
  });

  it('should render correct admin links', function() {
    const vm = mountRoutedComponent();
    const links = vm.$el.querySelectorAll('.header .admin-items a');
    expect(links.length).to.equal(1);
    expect(links[0].textContent).to.equal('Login');
  });

  describe('route highlight', () => {
    it('should not highlight unknown routes', () => {
      const vm = mountRoutedComponent('Bogus');
      const links = vm.$el.querySelectorAll('.header a');
      expect(links[0].classList.contains('active')).to.be.false;
      expect(links[1].classList.contains('active')).to.be.false;
      expect(links[2].classList.contains('active')).to.be.false;
      expect(links[3].classList.contains('active')).to.be.false;
      expect(links[4].classList.contains('active')).to.be.false;
    });

    it('should highlight the home route', () => {
      const vm = mountRoutedComponent('Home');
      const links = vm.$el.querySelectorAll('.header a');
      expect(links[0].classList.contains('active')).to.be.true;
      expect(links[1].classList.contains('active')).to.be.false;
      expect(links[2].classList.contains('active')).to.be.false;
      expect(links[3].classList.contains('active')).to.be.false;
      expect(links[4].classList.contains('active')).to.be.false;
    });

    it('should highlight the categories route', () => {
      const vm = mountRoutedComponent('Categories');
      const links = vm.$el.querySelectorAll('.header a');
      expect(links[0].classList.contains('active')).to.be.false;
      expect(links[1].classList.contains('active')).to.be.true;
      expect(links[2].classList.contains('active')).to.be.false;
      expect(links[3].classList.contains('active')).to.be.false;
      expect(links[4].classList.contains('active')).to.be.false;
    });

    it('should highlight the links route', () => {
      const vm = mountRoutedComponent('Links');
      const links = vm.$el.querySelectorAll('.header a');
      expect(links[0].classList.contains('active')).to.be.fale;
      expect(links[1].classList.contains('active')).to.be.false;
      expect(links[2].classList.contains('active')).to.be.false;
      expect(links[3].classList.contains('active')).to.be.true;
      expect(links[4].classList.contains('active')).to.be.false;
    });

    it('should highlight the ratings route', () => {
      const vm = mountRoutedComponent('Ratings');
      const links = vm.$el.querySelectorAll('.header a');
      expect(links[0].classList.contains('active')).to.be.false;
      expect(links[1].classList.contains('active')).to.be.false;
      expect(links[2].classList.contains('active')).to.be.true;
      expect(links[3].classList.contains('active')).to.be.false;
      expect(links[4].classList.contains('active')).to.be.false;
    });

    it('should highlight the login route', () => {
      const vm = mountRoutedComponent('Login');
      const links = vm.$el.querySelectorAll('.header a');
      expect(links[0].classList.contains('active')).to.be.false;
      expect(links[1].classList.contains('active')).to.be.false;
      expect(links[2].classList.contains('active')).to.be.false;
      expect(links[3].classList.contains('active')).to.be.false;
      expect(links[4].classList.contains('active')).to.be.true;
    });
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
