'use strict';

import authentication from '@/api/authentication';
import loginData from '@/assets/test-data/login';

describe('authentication', () => {
  it('exists', () => {
    expect(authentication).to.exist;
  });

  describe('login', () => {
    it('posts to the login', () => {
      return authentication
        .login('test@testy.org', 'TheValidPa$$w0rd')
        .then(res => {
          let expected = JSON.parse(JSON.stringify(loginData.success));
          expected.user.email = 'test@testy.org';
          expect(res).to.deep.equal(expected);
        });
    });
  });
});
