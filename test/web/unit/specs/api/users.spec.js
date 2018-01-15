'use strict';

import Vue from 'vue';
import users from '@/api/users';
import testData from '../../test-data';

describe('users', () => {
  it('exists', () => {
    expect(users).to.exist;
  });

  describe('current', () => {
    const currentUser = {
      id: 1138,
      firstName: 'Jackson',
      lastName: 'Josephini',
      email: 'jj@test.org',
      roles: ['admin', 'user']
    };

    beforeEach(() => {
      testData.initialize();
      testData.setResponse('/api/users/current', {
        status: 200,
        body: currentUser
      });
    });

    afterEach(() => {
      testData.restore();
    });

    it('gets the current user', async () => {
      await users.current();
      expect(Vue.http.get.calledOnce).to.be.true;
      expect(Vue.http.get.calledWith('/api/users/current')).to.be.true;
    });

    it('unpacks the body of the response', async () => {
      const res = await users.current();
      expect(res).to.deep.equal(currentUser);
    });
  });
});
