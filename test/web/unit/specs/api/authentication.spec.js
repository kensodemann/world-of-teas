'use strict';

import Vue from 'vue';
import authentication from '@/api/authentication';
import testData from '../../test-data';

const loginResponse = {
  success: true,
  user: {
    id: 42,
    firstName: 'Testy',
    lastName: 'McTersterson',
    email: 'something@test.org',
    roles: ['admin', 'user']
  },
  token: 'this would be a valid token'
};

describe('authentication', () => {
  it('exists', () => {
    expect(authentication).to.exist;
  });

  describe('login', () => {
    beforeEach(() => {
      testData.initialize();
      testData.setPostResponse('/api/login', {
        status: 200,
        body: loginResponse
      });
    });

    afterEach(() => {
      testData.restore();
    });

    it('posts to the login endpoint', async () => {
      await authentication.login('test@testy.org', 'TheValidPa$$w0rd');
      expect(Vue.http.post.calledOnce).to.be.true;
      expect(
        Vue.http.post.calledWith('/api/login', {
          username: 'test@testy.org',
          password: 'TheValidPa$$w0rd'
        })
      ).to.be.true;
    });

    it('unpacks the response body', async () => {
      const res = await authentication.login(
        'test@testy.org',
        'TheValidPa$$w0rd'
      );
      const expected = JSON.parse(JSON.stringify(loginResponse));
      expect(res).to.deep.equal(expected);
    });
  });
});
