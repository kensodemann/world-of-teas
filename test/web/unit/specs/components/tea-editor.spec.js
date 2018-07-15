'use strict';

import Component from '@/components/tea-editor';

import { mountComponent } from '../../util';

describe('tea-editor.vue', () => {
  it('can be instantiated', () => {
    const vm = mountComponent(Component);
    expect(vm).to.exist;
  });

  describe('category options', () => {
    it('contains a non-value option', () => {
      const vm = mountComponent(Component);
      expect(vm.categoryOptions[0]).to.deep.equal({
        value: null,
        text: 'Please select a category'
      });
    });

    it('contains an entry for each category in the store', () => {
      const vm = mountComponent(Component);
      const cats = vm.$store.state.teaCategories.list;
      expect(vm.categoryOptions.length).to.equal(cats.length + 1);
      for (let idx = 0; idx < cats.length; idx++) {
        expect(vm.categoryOptions[idx + 1].value).to.deep.equal(cats[idx]);
        expect(vm.categoryOptions[idx + 1].text).to.deep.equal(cats[idx].name);
      }
    });
  });

  describe('creating a new tea', () => {
    describe('initial render', () => {
      it('hides all error messages', () => {
        const vm = mountComponent(Component);
        const msgs = vm.$el.querySelectorAll('small.text-danger');
        for (let idx = 0; idx < msgs.length; idx++) {
          expect(msgs[idx].style.display).to.equal('none');
        }
      });

      it('contains no data', () => {
        const vm = mountComponent(Component);
        const inputs = vm.$el.querySelectorAll('input');
        for (let idx = 0; idx < inputs.length; idx++) {
          expect(inputs[0].value).to.equal('');
        }
      });
    });
  });

  describe('updating an existing tea', () => {
    describe('initial render', () => {
      it('hides all error messages', () => {
        const vm = mountComponent(Component);
        const msgs = vm.$el.querySelectorAll('small.text-danger');
        for (let idx = 0; idx < msgs.length; idx++) {
          expect(msgs[idx].style.display).to.equal('none');
        }
      });

      it('loads the data', () => {});
    });
  });
});
