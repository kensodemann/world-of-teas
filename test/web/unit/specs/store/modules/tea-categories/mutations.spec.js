import mutations from '@/store/modules/tea-categories/mutations';

describe('tea categories mutations', () => {
  let testData;
  beforeEach(initializeTestData);

  describe('load', () => {
    it('initializes the tea category list', () => {
      const state = {};
      mutations.load(state, testData);
      expect(state.list).to.deep.equal(testData);
    });

    it('initializes the tea category hash', () => {
      const state = {};
      mutations.load(state, testData);
      expect(state.hash).to.deep.equal({
        1: {
          id: 1,
          name: 'Green',
          description: 'Non - oxidized, mild tea'
        },
        2: {
          id: 2,
          name: 'Black',
          description: 'Oxidized tea'
        },
        3: {
          id: 3,
          name: 'Herbal',
          description: 'Not a tea'
        },
        4: {
          id: 4,
          name: 'Oolong',
          description: 'Chinese deliciousness'
        }
      });
    });
  });

  function initializeTestData() {
    testData = [
      {
        id: 1,
        name: 'Green',
        description: 'Non - oxidized, mild tea'
      },
      {
        id: 2,
        name: 'Black',
        description: 'Oxidized tea'
      },
      {
        id: 3,
        name: 'Herbal',
        description: 'Not a tea'
      },
      {
        id: 4,
        name: 'Oolong',
        description: 'Chinese deliciousness'
      }
    ];
  }
});
