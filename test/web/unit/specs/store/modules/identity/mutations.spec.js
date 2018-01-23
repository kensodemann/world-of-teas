'use strict';

import mutations from '@/store/modules/identity/mutations';

describe('identity mutation', () => {
  beforeEach(() => {
    sinon.stub(localStorage, 'setItem');
    sinon.stub(localStorage, 'removeItem');
  });

  afterEach(() => {
    localStorage.setItem.restore();
    localStorage.removeItem.restore();
  });

  describe('login', () => {
    it('sets the token', () => {
      const state = {};
      mutations.login(state, { user: {}, token: '3499iiigoie95030' });
      expect(state.token).to.equal('3499iiigoie95030');
    });

    it('saves the token to local storage', () => {
      const state = {};
      mutations.login(state, { token: '3499iiigoie95030' });
      expect(localStorage.setItem.calledOnce).to.be.true;
      expect(
        localStorage.setItem.calledWith(
          'world-of-teas.token',
          '3499iiigoie95030'
        )
      ).to.be.true;
    });

    it('sets the user', () => {
      const state = {};
      mutations.login(state, {
        user: {
          id: 42,
          firstName: 'Douglas',
          lastName: 'Adams',
          email: 'deep.thought@test.org'
        },
        token: '3499iiigoie95030'
      });
      expect(state.user).to.deep.equal({
        id: 42,
        firstName: 'Douglas',
        lastName: 'Adams',
        email: 'deep.thought@test.org'
      });
    });
  });

  describe('logout', () => {
    it('clears the token', () => {
      const state = {
        token: '3499iiigoie95030'
      };
      mutations.logout(state);
      expect(state.token).to.equal('');
    });

    it('removes the token from local storage', () => {
      const state = {
        token: '3499iiigoie95030'
      };
      mutations.logout(state);
      expect(localStorage.removeItem.calledOnce).to.be.true;
      expect(localStorage.removeItem.calledWith('world-of-teas.token')).to.be
        .true;
    });

    it('clears the user', () => {
      const state = {
        user: {
          id: 42,
          firstName: 'Douglas',
          lastName: 'Adams',
          email: 'deep.thought@test.org'
        },
        token: '3499iiigoie95030'
      };
      mutations.logout(state);
      expect(state.user).to.deep.equal({});
    });
  });

  describe('user', () => {
    let state;
    beforeEach(() => {
      state = {
        user: {
          id: 42,
          firstName: 'Douglas',
          lastName: 'Adams',
          email: 'deep.thought@test.org'
        },
        token: '3499iiigoie95030'
      };
    });

    it('sets the firstName', () => {
      mutations.user(state, {
        firstName: 'Jimmy',
        lastName: 'Johnson',
        email: 'jj@nascar.com'
      });
      expect(state.user.firstName).to.equal('Jimmy');
    });

    it('sets the lastName', () => {
      mutations.user(state, {
        firstName: 'Jimmy',
        lastName: 'Johnson',
        email: 'jj@nascar.com'
      });
      expect(state.user.lastName).to.equal('Johnson');
    });

    it('sets the email', () => {
      mutations.user(state, {
        firstName: 'Jimmy',
        lastName: 'Johnson',
        email: 'jj@nascar.com'
      });
      expect(state.user.email).to.equal('jj@nascar.com');
    });
  });
});
