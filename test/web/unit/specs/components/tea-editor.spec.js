'use strict';

import Vue from 'vue';

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

    describe('can save', () => {
      it('starts false', () => {
        const vm = mountComponent(Component);
        expect(vm.canSave).to.be.false;
      });

      it('is true when required fields have values', async () => {
        const vm = mountComponent(Component);
        await setInput(vm, '#teaEditorNameInput', 'a');
        expect(vm.canSave).to.be.false;
        await setSelect(vm, '#teaEditorCategorySelect', {
          id: 3,
          name: 'Herbal',
          description: 'Not a tea'
        });
        expect(vm.canSave).to.be.true;
      });

      it('is false if there is an error', async () => {
        const vm = mountComponent(Component);
        await setInput(vm, '#teaEditorNameInput', 'a');
        await setSelect(vm, '#teaEditorCategorySelect', {
          id: 3,
          name: 'Herbal',
          description: 'Not a tea'
        });
        expect(vm.canSave).to.be.true;
        await setInput(vm, '#teaEditorNameInput', '');
        expect(vm.canSave).to.be.false;
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

    describe('can save', () => {});
  });

  describe('save', () => {
    it('stores the data', async () => {
      const vm = mountComponent(Component);
      await setInput(vm, '#teaEditorNameInput', 'Herbal Lemon');
      await setSelect(vm, '#teaEditorCategorySelect', {
        id: 3,
        name: 'Herbal',
        description: 'Not a tea'
      });
      await setInput(
        vm,
        '#teaEditorDescriptionInput',
        'Light and fresh and citrus'
      );
      await setInput(
        vm,
        '#teaEditorInstructionsInput',
        'Put the bag in the hot water'
      );
      vm.form.rating = 3;
      await setInput(
        vm,
        '#teaEditorPurchaseLinkInput',
        'http://www.tea.com/lemon'
      );
      await setInput(vm, '#teaEditorPurchasePriceInput', 15.25);
      sinon.stub(vm.$store, 'dispatch');
      vm.save();
      expect(vm.$store.dispatch.calledOnce).to.be.true;
      expect(
        vm.$store.dispatch.calledWith('teas/save', {
          name: 'Herbal Lemon',
          teaCategoryId: 1,
          teaCategoryName: 'Green',
          description: 'Light and fresh and citrus',
          instructions: 'Put the bag in the hot water',
          rating: 3
        })
      ).to.be.true;
      vm.$store.dispatch.restore();
    });
  });

  async function setInput(vm, id, value) {
    const inp = vm.$el.querySelector(id);
    inp.value = value;
    inp.dispatchEvent(new Event('input'));
    await Vue.nextTick();
  }

  async function setSelect(vm, id, value) {
    const sel = vm.$el.querySelector(id);
    sel.value = value;
    sel.dispatchEvent(new Event('change'));
    await Vue.nextTick();
  }
});
