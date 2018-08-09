'use strict';

import Vue from 'vue';

import Component from '@/components/tea-editor';
import { mountComponent } from '../../util';

describe('tea-editor.vue', () => {
  it('can be instantiated', async () => {
    const vm = await mountComponent(Component);
    expect(vm).to.exist;
  });

  describe('category options', () => {
    it('contains a non-value option', async () => {
      const vm = await mountComponent(Component);
      expect(vm.categoryOptions[0]).to.deep.equal({
        value: null,
        text: 'Please select a category'
      });
    });

    it('contains an entry for each category in the store', async () => {
      const vm = await mountComponent(Component);
      const cats = vm.$store.state.teaCategories.list;
      expect(vm.categoryOptions.length).to.equal(cats.length + 1);
      for (let idx = 0; idx < cats.length; idx++) {
        expect(vm.categoryOptions[idx + 1].value).to.deep.equal(cats[idx]);
        expect(vm.categoryOptions[idx + 1].text).to.deep.equal(cats[idx].name);
      }
    });
  });

  describe('creating a new tea', () => {
    let vm;
    beforeEach(async () => {
      vm = await mountComponent(Component);
      vm.show();
      await Vue.nextTick();
    });

    describe('initial render', () => {
      it('shows an error for the name', () => {
        expect(vm.errors.count()).to.equal(1);
        expect(vm.errors.first('teaEditorNameInput')).to.equal(
          'The name field is required.'
        );
      });

      it('contains no data', () => {
        const inputs = vm.$el.querySelectorAll('input');
        for (let idx = 0; idx < inputs.length; idx++) {
          expect(inputs[0].value).to.equal('');
        }
      });
    });

    describe('can save', () => {
      it('starts false', () => {
        expect(vm.canSave()).to.be.false;
      });

      it('is true when required fields have values', async () => {
        await setInput(vm, '#teaEditorNameInput', 'a');
        expect(vm.canSave()).to.be.false;
        await setSelect(vm, '#teaEditorCategorySelect', 1);
        expect(vm.canSave()).to.be.true;
      });

      it('is false if there is an error', async () => {
        await setInput(vm, '#teaEditorNameInput', 'a');
        await setSelect(vm, '#teaEditorCategorySelect', 1);
        expect(vm.canSave()).to.be.true;
        await setInput(vm, '#teaEditorPurchaseLinkInput', 'h');
        await Vue.nextTick();
        expect(vm.canSave()).to.be.false;
      });
    });
  });

  describe('updating an existing tea', () => {
    let vm;
    let tea;
    beforeEach(async () => {
      vm = await mountComponent(Component);
      tea = vm.$store.state.teas.hash[30];
      vm.show(tea);
    });

    describe('initial render', () => {
      it('starts with no error messages', () => {
        expect(vm.errors.count()).to.equal(0);
      });

      it('initializes the form data', () => {
        expect(vm.form.name).to.equal(tea.name);
        expect(vm.form.description).to.equal(tea.description);
        expect(vm.form.instructions).to.equal(tea.instructions);
        expect(vm.form.url).to.equal(tea.url);
        expect(vm.form.price).to.equal(tea.price);
        expect(vm.form.rating).to.equal(tea.rating);
        expect(vm.form.category).to.deep.equal(
          vm.$store.state.teaCategories.hash[tea.teaCategoryId]
        );
      });
    });

    describe('can save', () => {
      it('starts false', () => {
        expect(vm.canSave()).to.be.false;
      });

      it('is true when the name changes', async () => {
        await setInput(vm, '#teaEditorNameInput', tea.name + 'a');
        expect(vm.canSave()).to.be.true;
        await setInput(vm, '#teaEditorNameInput', tea.name);
        expect(vm.canSave()).to.be.false;
      });

      it('is true when the type changes', async () => {
        const idx = getSelectIndex(vm, '#teaEditorCategorySelect');
        await setSelect(vm, '#teaEditorCategorySelect', idx - 1);
        expect(vm.canSave()).to.be.true;
        await setSelect(vm, '#teaEditorCategorySelect', idx);
        expect(vm.canSave()).to.be.false;
      });

      it('is true when the description changes', async () => {
        await setInput(vm, '#teaEditorDescriptionInput', tea.description + 'a');
        expect(vm.canSave()).to.be.true;
        await setInput(vm, '#teaEditorDescriptionInput', tea.description);
        expect(vm.canSave()).to.be.false;
      });

      it('is true when the instructions change', async () => {
        await setInput(vm, '#teaEditorInstructionsInput', tea.instructions + 'B');
        expect(vm.canSave()).to.be.true;
        await setInput(vm, '#teaEditorInstructionsInput', tea.instructions);
        expect(vm.canSave()).to.be.false;
      });

      it('is true when the rating changes', () => {
        vm.form.rating = tea.rating + 1;
        expect(vm.canSave()).to.be.true;
        vm.form.rating = tea.rating;
        expect(vm.canSave()).to.be.false;
      });

      it('is true when the URL changes', async () => {
        await setInput(vm, '#teaEditorPurchaseLinkInput', tea.url + 'l');
        expect(vm.canSave()).to.be.true;
        await setInput(vm, '#teaEditorPurchaseLinkInput', tea.url);
        expect(vm.canSave()).to.be.false;
      });

      it('is true when the price changes', async () => {
        await setInput(vm, '#teaEditorPurchasePriceInput', tea.price + 0.01);
        expect(vm.canSave()).to.be.true;
        await setInput(vm, '#teaEditorPurchasePriceInput', tea.price);
        expect(vm.canSave()).to.be.false;
      });
    });
  });

  describe('save', () => {
    it('stores the data', async () => {
      const vm = await mountComponent(Component);
      vm.show();
      await setInput(vm, '#teaEditorNameInput', 'Herbal Lemon');
      await setSelect(vm, '#teaEditorCategorySelect', 1);
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
          rating: 3,
          url: 'http://www.tea.com/lemon',
          price: '15.25'
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

  async function setSelect(vm, id, idx) {
    const sel = vm.$el.querySelector(id);
    sel.selectedIndex = idx;
    sel.dispatchEvent(new Event('change'));
    await Vue.nextTick();
  }

  function getSelectIndex(vm, id) {
    const sel = vm.$el.querySelector(id);
    return sel.selectedIndex;
  }
});
