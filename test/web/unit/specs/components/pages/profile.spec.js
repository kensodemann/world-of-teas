'use strict';

import Vue from 'vue';
import Page from '@/components/pages/profile';
import store from '@/store';
import util from '../../../util';

describe('profile.vue', () => {
  it('should render correct contents', () => {
    const vm = util.mountComponent(Page);
    expect(
      vm.$el.querySelector('#profileFirstNameGroup label').textContent
    ).to.equal('First Name:');
    expect(
      vm.$el.querySelector('#profileLastNameGroup label').textContent
    ).to.equal('Last Name:');
    expect(
      vm.$el.querySelector('#profileEmailAddressGroup label').textContent
    ).to.equal('Email Address:');
  });

  describe('created hook', () => {
    it('assigns the form data', () => {
      store.commit('identity/login', {
        token: 'IAmAToken',
        user: {
          id: 42,
          firstName: 'Ford',
          lastName: 'Prefect',
          email: 'fp@galactic.travels.com'
        }
      });
      const vm = util.mountComponent(Page);
      expect(vm.form.id).to.equal(42);
      expect(vm.form.firstName).to.equal('Ford');
      expect(vm.form.lastName).to.equal('Prefect');
      expect(vm.form.email).to.equal('fp@galactic.travels.com');
    });

    it('sets a watch if there is not user on create', async () => {
      store.commit('identity/logout');
      const vm = util.mountComponent(Page);
      expect(vm.form.id).to.be.equal('');
      expect(vm.form.firstName).to.equal('');
      expect(vm.form.lastName).to.equal('');
      expect(vm.form.email).to.equal('');
      store.commit('identity/login', {
        token: 'IAmAToken',
        user: {
          id: 42,
          firstName: 'Ford',
          lastName: 'Prefect',
          email: 'fp@galactic.travels.com'
        }
      });
      await Vue.nextTick();
      expect(vm.form.id).to.equal(42);
      expect(vm.form.firstName).to.equal('Ford');
      expect(vm.form.lastName).to.equal('Prefect');
      expect(vm.form.email).to.equal('fp@galactic.travels.com');
    });
  });

  describe('save', () => {
    let vm;
    beforeEach(() => {
      vm = util.mountComponent(Page);
      sinon.stub(vm.$store, 'dispatch');
      vm.$store.dispatch.returns(Promise.resolve({}));
    });

    afterEach(() => {
      vm.$store.dispatch.restore();
    });

    it('dispatches a save action on the identity', () => {
      vm.form.id = 1138;
      vm.form.firstName = 'Joe';
      vm.form.lastName = 'Cuppa';
      vm.form.email = 'coffee.boi@test.org';
      vm.save();
      expect(vm.$store.dispatch.calledOnce).to.be.true;
      expect(vm.$store.dispatch.calledWith('identity/save', vm.form)).to.be
        .true;
    });

    it('displays an error message on error', async () => {
      vm.$store.dispatch.returns(
        // eslint-disable-next-line prefer-promise-reject-errors
        Promise.reject({
          status: 400,
          body: { reason: 'I just do not want to save things for you anymore' }
        })
      );
      vm.save();
      await Vue.nextTick();
      expect(vm.errorMessage).to.equal(
        'I just do not want to save things for you anymore'
      );
    });
  });
});
