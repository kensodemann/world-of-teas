'use strict';

module.exports = {
  success: {
    success: true,
    user: {
      id: 42,
      firstName: 'Testy',
      lastName: 'McTersterson',
      email: undefined,
      roles: ['admin', 'user']
    },
    token: 'this would be a valid token'
  },
  failure: { success: false }
};
