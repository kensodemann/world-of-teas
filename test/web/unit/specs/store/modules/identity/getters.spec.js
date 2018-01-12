'use strict';

import getters from '@/store/modules/identity/getters';

describe('identity getters', () => {
  describe('name', () => {
    it('returns nothing if there is no user', () => {
      expect(getters.name({})).to.be.undefined;
      expect(getters.name({user: {}})).to.be.undefined;
    });

    it('returns the name', () => {
      expect(getters.name({
        user: {
          id: 42,
          firstName: 'Douglas',
          lastName: 'Adams'
        }
      })).to.equal('Douglas Adams');
    });
  });
});
