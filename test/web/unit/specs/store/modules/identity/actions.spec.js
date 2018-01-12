'use strict';

import actions from '@/store/modules/identity/actions';
import authentication from '@/api/authentication';
import users from '@/api/users';

describe('identity action', () => {
  let commit;
  beforeEach(() => {
    commit = sinon.stub();
  });

  describe('login', () => {
    beforeEach(() => {
      sinon.stub(authentication, 'login');
      authentication.login.returns(Promise.resolve({ success: false }));
    });

    afterEach(() => {
      authentication.login.restore();
    });

    it('calls authentication service login', () => {
      actions.login(
        { commit },
        {
          username: 'testy@test.org',
          password: 'Pas$w0rd'
        }
      );
      expect(authentication.login.calledOnce).to.be.true;
      expect(authentication.login.calledWith('testy@test.org', 'Pas$w0rd')).to
        .be.true;
    });

    it('commits the result if success', async () => {
      authentication.login.returns(
        Promise.resolve({
          success: true,
          user: {
            id: 4,
            firstName: 'Ken',
            lastName: 'Sodemann',
            email: 'ken.sodemann@gmail.com',
            roles: ['admin', 'user']
          },
          token: 'ThisIsATokenDude'
        })
      );
      await actions.login(
        { commit },
        {
          username: 'testy@test.org',
          password: 'Pas$w0rd'
        }
      );
      expect(commit.calledOnce).to.be.true;
      expect(
        commit.calledWith('login', {
          success: true,
          user: {
            id: 4,
            firstName: 'Ken',
            lastName: 'Sodemann',
            email: 'ken.sodemann@gmail.com',
            roles: ['admin', 'user']
          },
          token: 'ThisIsATokenDude'
        })
      ).to.be.true;
    });

    it('does not commit the results if not success', async () => {
      await actions.login(
        { commit },
        {
          username: 'testy@test.org',
          password: 'Pas$w0rd'
        }
      );
      expect(commit.called).to.be.false;
    });

    it('return the result', async () => {
      expect(
        await actions.login(
          { commit },
          {
            username: 'testy@test.org',
            password: 'Pas$w0rd'
          }
        )
      ).to.deep.equal({ success: false });
    });
  });

  describe('logout', () => {});

  describe('refresh', () => {
    beforeEach(() => {
      sinon.stub(localStorage, 'getItem');
      sinon.stub(users, 'current');
      localStorage.getItem.returns('');
    });

    afterEach(() => {
      localStorage.getItem.restore();
      users.current.restore();
    });

    it('gets the token from local storage', async () => {
      await actions.refresh({ commit });
      expect(localStorage.getItem.calledOnce).to.be.true;
      expect(localStorage.getItem.calledWith('world-of-teas.token')).to.be.true;
    });

    describe('when a token exists', () => {
      beforeEach(() => {
        localStorage.getItem.returns('abc');
      });

      it('commits the token', async () => {
        await actions.refresh({ commit });
        expect(commit.calledTwice).to.be.true;
        expect(commit.calledWithExactly('login', { token: 'abc' })).to.be.true;
      });

      it('gets the current user', async () => {
        await actions.refresh({ commit });
        expect(users.current.calledOnce).to.be.true;
      });

      it('commits the token and user if there is a valid user', async () => {
        users.current.returns(
          Promise.resolve({
            id: 42,
            firstName: 'Douglas',
            lastName: 'Adams'
          })
        );
        await actions.refresh({ commit });
        expect(commit.calledTwice).to.be.true;
        expect(
          commit.calledWithExactly('login', {
            token: 'abc',
            user: {
              id: 42,
              firstName: 'Douglas',
              lastName: 'Adams'
            }
          })
        ).to.be.true;
      });

      it('commits a logout mutation if there is no user', async () => {
        users.current.returns({});
        await actions.refresh({commit});
        expect(commit.calledTwice).to.be.true;
        expect(commit.calledWith('logout')).to.be.true;
      });
    });

    describe('when no token exists', () => {
      it('does not attempt to get a current user', async () => {
        await actions.refresh({commit});
        expect(commit.called).to.be.false;
        expect(users.current.called).to.be.false;
      });
    });
  });
});
