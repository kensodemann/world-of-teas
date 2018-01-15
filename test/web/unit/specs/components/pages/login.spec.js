'use strict';

import Vue from 'vue';

import Page from '@/components/pages/login';

describe('login.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Page);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('#loginEmailGroup label').textContent).to.equal(
      'Email address:'
    );
    expect(
      vm.$el.querySelector('#loginPasswordGroup label').textContent
    ).to.equal('Password:');
  });

  describe('login', () => {
    let vm;
    beforeEach(() => {
      const Constructor = Vue.extend(Page);
      vm = new Constructor().$mount();
      sinon.spy(vm.$router, 'replace');
      sinon.stub(vm.$store, 'dispatch');
      vm.$store.dispatch.returns(Promise.resolve({ success: false }));
    });

    afterEach(() => {
      vm.$router.replace.restore();
      vm.$store.dispatch.restore();
    });

    it('should perform a login', async () => {
      vm.form.email = 'testlogin@test.org';
      vm.form.password = 'this.is.a.test';
      vm.login();
      expect(vm.$store.dispatch.calledOnce).to.be.true;
      expect(
        vm.$store.dispatch.calledWith('identity/login', {
          username: 'testlogin@test.org',
          password: 'this.is.a.test'
        })
      ).to.be.true;
    });

    describe('on success', () => {
      beforeEach(() => {
        vm.$store.dispatch.returns(Promise.resolve({ success: true }));
        vm.form.email = 'testlogin@test.org';
        vm.form.password = 'TheValidPa$$w0rd';
      });

      it('should navigate to the home page', async () => {
        vm.login();
        await Vue.nextTick();
        expect(vm.$router.replace.calledOnce).to.be.true;
        expect(vm.$router.replace.calledWith('/')).to.be.true;
      });

      it('clears the email and password', async () => {
        vm.login();
        await Vue.nextTick();
        expect(vm.form.email).to.equal('');
        expect(vm.form.password).to.equal('');
      });
    });

    describe('on failure', () => {
      beforeEach(() => {
        vm.$store.dispatch.returns(Promise.resolve({ success: false }));
        vm.form.email = 'testlogin@test.org';
        vm.form.password = 'PleaseFailMe';
      });

      it('should not navigate', async () => {
        vm.login();
        await Vue.nextTick();
        expect(vm.$router.replace.called).to.be.false;
      });

      it('should display a login failure message', async () => {
        vm.login();
        await Vue.nextTick();
        expect(vm.errorMessage).to.equal('Invalid email or password.');
      });

      it('clears only the password', async () => {
        vm.login();
        await Vue.nextTick();
        expect(vm.form.email).to.equal('testlogin@test.org');
        expect(vm.form.password).to.equal('');
      });
    });
  });
});
