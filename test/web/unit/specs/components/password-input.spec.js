'use strict';

import Vue from 'vue';

import Component from '@/components/password-input';
import { mountComponent } from '../../util';

describe('main-header.vue', () => {
  it('should render', async () => {
    const vm = await mountComponent(Component);
    const inputs = vm.$el.querySelectorAll('input');
    expect(inputs.length).to.equal(2);
  });

  it('should hide plain text by default', async () => {
    const vm = await mountComponent(Component);
    const inputs = vm.$el.querySelectorAll('input');
    expect(inputs[0].style.display).to.equal('');
    expect(inputs[1].style.display).to.equal('none');
  });

  it('should hide the password input and show the plain text input when told to show the password', async () => {
    const vm = await mountComponent(Component);
    const inputs = vm.$el.querySelectorAll('input');
    vm.showPassword = true;
    await Vue.nextTick();
    expect(inputs[0].style.display).to.equal('none');
    expect(inputs[1].style.display).to.equal('');
  });

  it('should pass through the placeholder', () => {
    const Constructor = Vue.extend(Component);
    const el = new Constructor();
    el.placeholder = 'Enter Password';
    const vm = el.$mount();
    const inputs = vm.$el.querySelectorAll('input');
    vm.placeholder = 'Enter Password';
    expect(inputs[0].placeholder).to.equal('Enter Password');
    expect(inputs[1].placeholder).to.equal('Enter Password');
  });
});
