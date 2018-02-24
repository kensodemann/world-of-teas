import mutations from '@/store/modules/purchase-links/mutations';

describe('purchase links mutations', () => {
  let expectedHash;
  let testData;
  beforeEach(initializeTestData);

  describe('load', () => {
    it('initializes the purchase links hash by tea', () => {
      const state = {};
      mutations.load(state, testData);
      expect(state.teas).to.deep.equal(expectedHash);
    });

    describe('with an existing teas hash', () => {
      let state;
      beforeEach(() => {
        state = {};
        mutations.load(state, [
          {
            id: 1,
            teaId: 10,
            url: 'http://some.store.com/getoffsgrass',
            price: 32.95
          },
          {
            id: 2,
            teaId: 20,
            url: 'http://some.store.com/whatever',
            price: 14.95
          },
          {
            id: 3,
            teaId: 10,
            url: 'http://some.otherstore.com/dude',
            price: 53.5
          }
        ]);
      });

      it('adds new teas to the hash', () => {
        mutations.load(state, [
          {
            id: 4,
            teaId: 30,
            url: 'http://someother.store.com/geoffsgrass',
            price: 23.95
          },
          {
            id: 5,
            teaId: 30,
            url: 'http://some.store.com/abide',
            price: 45.69
          }
        ]);
        expect(state.teas).to.deep.equal({
          10: [
            {
              id: 1,
              teaId: 10,
              url: 'http://some.store.com/getoffsgrass',
              price: 32.95
            },
            {
              id: 3,
              teaId: 10,
              url: 'http://some.otherstore.com/dude',
              price: 53.5
            }
          ],
          20: [
            {
              id: 2,
              teaId: 20,
              url: 'http://some.store.com/whatever',
              price: 14.95
            }
          ],
          30: [
            {
              id: 4,
              teaId: 30,
              url: 'http://someother.store.com/geoffsgrass',
              price: 23.95
            },
            {
              id: 5,
              teaId: 30,
              url: 'http://some.store.com/abide',
              price: 45.69
            }
          ]
        });
      });

      it('replaces existing teas in the hash', () => {
        mutations.load(state, [
          {
            id: 6,
            teaId: 10,
            url: 'http://some.bigstore.com/general',
            price: 90.95
          }
        ]);
        expect(state.teas).to.deep.equal({
          10: [
            {
              id: 6,
              teaId: 10,
              url: 'http://some.bigstore.com/general',
              price: 90.95
            }
          ],
          20: [
            {
              id: 2,
              teaId: 20,
              url: 'http://some.store.com/whatever',
              price: 14.95
            }
          ]
        });
      });
    });
  });

  describe('remove', () => {
    let state;
    beforeEach(() => {
      state = {};
      mutations.load(state, testData);
    });

    it('removes the correct link', () => {
      mutations.remove(state, {
        id: 7,
        teaId: 20,
        url: 'http://some.smallstore.com/gizmo',
        price: 44.35
      });
      expect(state.teas[20]).to.deep.equal([
        {
          id: 2,
          teaId: 20,
          url: 'http://some.store.com/whatever',
          price: 14.95
        },
        {
          id: 8,
          teaId: 20,
          url: 'http://some.store.com/cowpie',
          price: 17.67
        }
      ]);
    });

    it('removes the tea node if that was the last link for that tea', () => {
      mutations.remove(state, {
        id: 9,
        teaId: 40,
        url: 'http://some.store.com/boots.on.the.ground',
        price: 19.87
      });
      expect(state.teas[40]).to.be.undefined;
    });

    it('does nothing if the tea for the link was not in the store', () => {
      mutations.remove(state, {
        id: 9,
        teaId: 99,
        url: 'http://some.store.com/boots.on.the.ground',
        price: 19.87
      });
      expect(state.teas).to.deep.equal(expectedHash);
    });

    it('does nothing if the link is not in the store', () => {
      mutations.remove(state, {
        id: 21,
        teaId: 20,
        url: 'http://some.smallstore.com/gizmo',
        price: 44.35
      });
      expect(state.teas).to.deep.equal(expectedHash);
    });
  });

  describe('save', () => {
    let state;
    beforeEach(() => {
      state = {};
      mutations.load(state, testData);
    });

    describe('a new link', () => {
      it('adds the link to the correct tea', () => {
        mutations.save(state, {
          id: 101,
          teaId: 20,
          url: 'http://some.smallstore.com/fuzzy',
          price: 19.99
        });
        expect(state.teas[20].length).to.equal(4);
        expect(state.teas[20][3]).to.deep.equal({
          id: 101,
          teaId: 20,
          url: 'http://some.smallstore.com/fuzzy',
          price: 19.99
        });
      });

      it('creates a tea node if the tea did not exist in the store', () => {
        mutations.save(state, {
          id: 101,
          teaId: 42,
          url: 'http://some.smallstore.com/fuzzy',
          price: 19.99
        });
        expect(state.teas[42].length).to.equal(1);
        expect(state.teas[42][0]).to.deep.equal({
          id: 101,
          teaId: 42,
          url: 'http://some.smallstore.com/fuzzy',
          price: 19.99
        });
      });
    });

    describe('an existing node', () => {
      it('updates the link', () => {
        mutations.save(state, {
          id: 5,
          teaId: 30,
          url: 'http://some.store.com/inme',
          price: 42.73
        });
        expect(state.teas[30].length).to.equal(2);
        expect(state.teas[30][1]).to.deep.equal({
          id: 5,
          teaId: 30,
          url: 'http://some.store.com/inme',
          price: 42.73
        });
      });
    });
  });

  function initializeTestData() {
    testData = [
      {
        id: 1,
        teaId: 10,
        url: 'http://some.store.com/getoffsgrass',
        price: 32.95
      },
      {
        id: 2,
        teaId: 20,
        url: 'http://some.store.com/whatever',
        price: 14.95
      },
      {
        id: 3,
        teaId: 10,
        url: 'http://some.otherstore.com/dude',
        price: 53.5
      },
      {
        id: 4,
        teaId: 30,
        url: 'http://someother.store.com/geoffsgrass',
        price: 23.95
      },
      {
        id: 5,
        teaId: 30,
        url: 'http://some.store.com/abide',
        price: 45.69
      },
      {
        id: 6,
        teaId: 10,
        url: 'http://some.bigstore.com/general',
        price: 90.95
      },
      {
        id: 7,
        teaId: 20,
        url: 'http://some.smallstore.com/gizmo',
        price: 44.35
      },
      {
        id: 8,
        teaId: 20,
        url: 'http://some.store.com/cowpie',
        price: 17.67
      },
      {
        id: 9,
        teaId: 40,
        url: 'http://some.store.com/boots.on.the.ground',
        price: 19.87
      },
      {
        id: 10,
        teaId: 70,
        url: 'http://some.oddstore.com/wut',
        price: 17.86
      },
      {
        id: 11,
        teaId: 60,
        url: 'http://some.store.com/stormy',
        price: 14.95
      }
    ];

    expectedHash = {
      10: [
        {
          id: 1,
          teaId: 10,
          url: 'http://some.store.com/getoffsgrass',
          price: 32.95
        },
        {
          id: 3,
          teaId: 10,
          url: 'http://some.otherstore.com/dude',
          price: 53.5
        },
        {
          id: 6,
          teaId: 10,
          url: 'http://some.bigstore.com/general',
          price: 90.95
        }
      ],
      20: [
        {
          id: 2,
          teaId: 20,
          url: 'http://some.store.com/whatever',
          price: 14.95
        },
        {
          id: 7,
          teaId: 20,
          url: 'http://some.smallstore.com/gizmo',
          price: 44.35
        },
        {
          id: 8,
          teaId: 20,
          url: 'http://some.store.com/cowpie',
          price: 17.67
        }
      ],
      30: [
        {
          id: 4,
          teaId: 30,
          url: 'http://someother.store.com/geoffsgrass',
          price: 23.95
        },
        {
          id: 5,
          teaId: 30,
          url: 'http://some.store.com/abide',
          price: 45.69
        }
      ],
      40: [
        {
          id: 9,
          teaId: 40,
          url: 'http://some.store.com/boots.on.the.ground',
          price: 19.87
        }
      ],
      70: [
        {
          id: 10,
          teaId: 70,
          url: 'http://some.oddstore.com/wut',
          price: 17.86
        }
      ],
      60: [
        {
          id: 11,
          teaId: 60,
          url: 'http://some.store.com/stormy',
          price: 14.95
        }
      ]
    };
  }
});
