'use strict';

import Page from '@/components/pages/change-password';
import store from '@/store';

import { mountComponent } from '../../../util';
import dataServiceLogger from '@/assets/test-data/data-service-logger';

describe('change-password.vue', () => {
  let vm;
  beforeEach(() => {
    vm = mountComponent(Page);
    dataServiceLogger.reset();
  });

  it('should render correct contents', () => {
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
    beforeEach(() => {
      store.commit('identity/login', {
        token: 'asdfiig93',
        user: {
          id: 73,
          firstName: 'Sheldon',
          lastName: 'Cooper'
        }
      });
      sinon.stub(vm.$router, 'replace');
    });

    afterEach(() => {
      vm.$router.replace.restore();
    });

    it('should perform a password change', async () => {
      vm.form.currentPassword = 'SomethingBad';
      vm.form.newPassword = 'SomethingM0r3Secure';
      await vm.changePassword();
      expect(dataServiceLogger.requests.length).to.equal(1);
      expect(dataServiceLogger.requests[0].url).to.equal(
        '/api/users/73/password'
      );
      expect(dataServiceLogger.requests[0].method).to.equal('POST');
      expect(dataServiceLogger.requests[0].body).to.deep.equal({
        currentPassword: 'SomethingBad',
        password: 'SomethingM0r3Secure'
      });
    });

    describe('on success', () => {
      it('should navigate to the profile page', async () => {
        vm.form.currentPassword = 'SomethingBad';
        vm.form.newPassword = 'SomethingM0r3Secure';
        await vm.changePassword();
        expect(vm.$router.replace.calledOnce).to.be.true;
        expect(vm.$router.replace.calledWith('/profile')).to.be.true;
      });
    });

    describe('on failure', () => {
      it('should not navigate', async () => {
        vm.form.currentPassword = 'WrongPassword';
        vm.form.newPassword = 'SomethingM0r3Secure';
        await vm.changePassword();
        expect(vm.$router.replace.called).to.be.false;
      });

      it('should show an error message', async () => {
        vm.form.currentPassword = 'WrongPassword';
        vm.form.newPassword = 'SomethingM0r3Secure';
        await vm.changePassword();
        expect(vm.errorMessage).to.equal('Error: Invalid Password.');
      });
    });
  });
});
