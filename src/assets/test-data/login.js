'use strict';

module.exports = {
  success: {
    success: true,
    user: {
      id: 42,
      firstName: 'Testy',
      lastName: 'McTersterson',
      email: 'something@test.org',
      roles: ['admin', 'user']
    },
    token: 'this would be a valid token'
  },
  failure: { success: false }
};
