'use strict';

import Vue from 'vue';
import Page from '@/components/pages/change-password';
import store from '@/store';

import mockHttp from '../../../mock-http';
import util from '../../../util';

describe('change-password.vue', () => {
  beforeEach(() => {
    mockHttp.initialize();
  });

  afterEach(() => {
    mockHttp.restore();
  });

  it('should render correct contents', () => {
    const Constructor = Vue.extend(Page);
    const vm = new Constructor().$mount();
    expect(
      vm.$el.querySelector('#changePasswordCurrentPasswordGroup label')
        .textContent
    ).to.equal('Current Password:');
    expect(
      vm.$el.querySelector('#changePasswordNewPasswordGroup label').textContent
    ).to.equal('New Password:');
    expect(
      vm.$el.querySelector('#changePasswordVerifyPasswordGroup label')
        .textContent
    ).to.equal('Verify Password:');
  });

  describe('change password', () => {
    let vm;
    beforeEach(() => {
      mockHttp.setPostResponse('/api/users/73/password', { status: 200 });
      store.commit('identity/login', {
        token: 'asdfiig93',
        user: {
          id: 73,
          firstName: 'Sheldon',
          lastName: 'Cooper'
        }
      });
      vm = util.mountComponent(Page);
      sinon.stub(vm.$router, 'replace');
    });

    afterEach(() => {
      vm.$router.replace.restore();
    });

    it('should perform a password change', async () => {
      vm.form.currentPassword = 'SomethingBad';
      vm.form.newPassword = 'SomethingM0r3Secure';
      await vm.changePassword();
      expect(Vue.http.post.calledOnce).to.be.true;
      expect(
        Vue.http.post.calledWith('/api/users/73/password', {
          currentPassword: 'SomethingBad',
          password: 'SomethingM0r3Secure'
        })
      ).to.be.true;
    });

    describe('on success', () => {
      it('should navigate to the profile page', async () => {
        mockHttp.setPostResponse('/api/users/73/password', {
          status: 200,
          body: { success: true }
        });
        await vm.changePassword();
        expect(vm.$router.replace.calledOnce).to.be.true;
        expect(vm.$router.replace.calledWith('/profile')).to.be.true;
      });
    });

    describe('on failure', () => {
      beforeEach(() => {
        mockHttp.setPostResponse('/api/users/73/password', {
          status: 400,
          body: { reason: 'Error: Invalid Password' }
        });
      });

      it('should not navigate', async () => {
        await vm.changePassword();
        expect(vm.$router.replace.called).to.be.false;
      });

      it('should show an error message', async () => {
        await vm.changePassword();
        expect(vm.errorMessage).to.equal('Error: Invalid Password');
      });
    });
  });
});
