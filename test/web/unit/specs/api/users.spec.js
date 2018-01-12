'use strict';

import users from '@/api/users';
import usersData from '@/assets/test-data/users';

describe('users', () => {
  it('exists', () => {
    expect(users).to.exist;
  });

  describe('current', () => {
    it('gets the current user', () => {
      return users.current().then(res => {
        let expected = JSON.parse(JSON.stringify(usersData.current));
        expect(res).to.deep.equal(expected);
      });
    });
  });
});
