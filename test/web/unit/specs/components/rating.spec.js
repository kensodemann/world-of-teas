'use strict';

import Vue from 'vue';
import Component from '@/components/rating';

describe('rating.vue', () => {
  it('renders five items', () => {
    const Constructor = Vue.extend(Component);
    const vm = new Constructor().$mount();
    const stars = vm.$el.querySelectorAll('.fa');
    expect(stars.length).to.equal(5);
  });

  it('renders all five as outlined stars', () => {
    const Constructor = Vue.extend(Component);
    const vm = new Constructor().$mount();
    const stars = vm.$el.querySelectorAll('.fa-star-o');
    expect(stars.length).to.equal(5);
  });

  it('renders the proper number of filled in stars', async () => {
    const Constructor = Vue.extend(Component);
    const vm = new Constructor().$mount();
    vm.stars = 3;
    await Vue.nextTick();
    const solid = vm.$el.querySelectorAll('.fa-star');
    const outline = vm.$el.querySelectorAll('.fa-star-o');
    expect(solid.length).to.equal(3);
    expect(outline.length).to.equal(2);
  });

  describe('on value updated', () => {
    it('emits an input event', () => {
      const Constructor = Vue.extend(Component);
      const vm = new Constructor().$mount();
      sinon.spy(vm, '$emit');
      vm.updateValue(2);
      expect(vm.$emit.calledOnce).to.be.true;
      expect(vm.$emit.calledWith('input', 2)).to.be.true;
    });

    it('shades the proper number of stars', async () => {
      const Constructor = Vue.extend(Component);
      const vm = new Constructor().$mount();
      sinon.spy(vm, '$emit');
      vm.updateValue(2);
      await Vue.nextTick();
      const solid = vm.$el.querySelectorAll('.fa-star');
      const outline = vm.$el.querySelectorAll('.fa-star-o');
      expect(solid.length).to.equal(2);
      expect(outline.length).to.equal(3);
    });
  });
});
