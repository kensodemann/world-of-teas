'use strict';

import Vue from 'vue';
import Component from '@/components/tea-category';
import { mountComponent } from '../../util';

describe('tea-category.vue', () => {
  let properties;
  beforeEach(() => {
    properties = {
      category: {
        id: 1,
        name: 'Green',
        description: 'Looks and tastes like grass'
      }
    };
  });

  describe('title', () => {
    it('renders correctly', async () => {
      const vm = await mountComponent(Component, properties);
      const title = vm.$el.querySelector('.card-title');
      expect(title.textContent).to.equal('Green');
    });

    it('responds to changes', async () => {
      const vm = await mountComponent(Component, properties);
      vm.category = {
        id: 2,
        name: 'Herbal',
        description: 'Is this even tea?'
      };
      await Vue.nextTick();
      const title = vm.$el.querySelector('.card-title');
      expect(title.textContent).to.equal('Herbal');
    });
  });

  describe('description', () => {
    it('renders correctly', async () => {
      const vm = await mountComponent(Component, properties);
      const text = vm.$el.querySelector('.card-text');
      expect(text.textContent.trim()).to.equal('Looks and tastes like grass');
    });

    it('responds to changes', async () => {
      const vm = await mountComponent(Component, properties);
      vm.category = {
        id: 2,
        name: 'Herbal',
        description: 'Is this even tea?'
      };
      await Vue.nextTick();
      const text = vm.$el.querySelector('.card-text');
      expect(text.textContent.trim()).to.equal('Is this even tea?');
    });
  });

  describe('button text', () => {
    it('renders correctly', async () => {
      const vm = await mountComponent(Component, properties);
      const btn = vm.$el.querySelector('.btn-primary');
      expect(btn.textContent.trim()).to.equal('List Green Teas');
    });

    it('responds to changes', async () => {
      const vm = await mountComponent(Component, properties);
      vm.category = {
        id: 2,
        name: 'Herbal',
        description: 'Is this even tea?'
      };
      await Vue.nextTick();
      const btn = vm.$el.querySelector('.btn-primary');
      expect(btn.textContent.trim()).to.equal('List Herbal Teas');
    });
  });

  describe('image', () => {
    it('renders correctly', async () => {
      const vm = await mountComponent(Component, properties);
      const img = vm.$el.querySelector('.card-img-top');
      expect(img.src).to.contain('/static/img/green.jpg');
    });

    it('responds to changes', async () => {
      const vm = await mountComponent(Component, properties);
      vm.category = {
        id: 2,
        name: 'Herbal',
        description: 'Is this even tea?'
      };
      await Vue.nextTick();
      const img = vm.$el.querySelector('.card-img-top');
      expect(img.src).to.contain('/static/img/herbal.jpg');
    });
  });
});
