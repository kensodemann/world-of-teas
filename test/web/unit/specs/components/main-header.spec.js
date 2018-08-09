'use strict';

import Component from '@/components/main-header';
import store from '@/store';
import { mountComponent } from '../../util';

describe('main-header.vue', () => {
  it('should render the brand', async () => {
    const vm = await mountComponent(Component);
    const links = vm.$el.querySelectorAll('.navbar-brand');
    expect(links.length).to.equal(1);
    expect(links[0].textContent).to.equal('World of Teas');
  });

  it('should render correct links', async () => {
    const vm = await mountComponent(Component);
    const links = vm.$el.querySelectorAll('.nav-item');
    expect(links.length).to.equal(4);
    expect(links[0].textContent).to.equal('Categories');
    expect(links[1].textContent).to.equal('Ratings');
    expect(links[2].textContent).to.equal('Links');
    expect(links[3].textContent).to.equal('Login');
  });

  it('switches from login to the usernane', async () => {
    store.commit('identity/login', {
      token: 'asdfiig93',
      user: {
        id: 73,
        firstName: 'Sheldon',
        lastName: 'Cooper'
      }
    });
    const vm = await mountComponent(Component);
    const links = vm.$el.querySelectorAll('.nav-item');
    expect(links.length).to.equal(4);
    expect(links[0].textContent).to.equal('Categories');
    expect(links[1].textContent).to.equal('Ratings');
    expect(links[2].textContent).to.equal('Links');
    expect(links[3].textContent).to.contain('Sheldon Cooper');

    const dropdown = links[3].querySelectorAll('.dropdown-item');
    expect(dropdown.length).to.equal(2);
    expect(dropdown[0].textContent).to.equal('My Profile');
    expect(dropdown[1].textContent).to.equal('Logout');
  });
});
