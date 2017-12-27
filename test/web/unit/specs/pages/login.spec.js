import sinon from 'sinon';
import Vue from 'vue';

import logger from '@/assets/test-data/data-service-logger';
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
      logger.reset();
      const Constructor = Vue.extend(Page);
      vm = new Constructor().$mount();
      sinon.spy(vm.$router, 'replace');
    });

    afterEach(() => {
      vm.$router.replace.restore();
    });

    it('should perform a login', async () => {
      vm.form.email = 'testlogin@test.org';
      vm.form.password = 'this.is.a.test';
      vm.login();
      expect(logger.requests.length).to.equal(1);
      expect(logger.requests[0].body).to.deep.equal({
        username: 'testlogin@test.org',
        password: 'this.is.a.test'
      });
      await Vue.nextTick();
    });

    describe('on success', () => {
      beforeEach(() => {
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
