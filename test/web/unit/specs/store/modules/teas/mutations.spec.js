import mutations from '@/store/modules/teas/mutations';

describe('teas mutations', () => {
  let testData;
  beforeEach(initializeTestData);

  describe('load', () => {
    it('initializes the tea list', () => {
      const state = {};
      mutations.load(state, testData);
      expect(state.list).to.deep.equal(testData);
    });

    it('initializes the tea hash', () => {
      const state = {};
      mutations.load(state, testData);
      expect(state.hash).to.deep.equal({
        10: {
          id: 10,
          name: 'Grassy Green',
          teaCategoryId: 1,
          teaCategoryName: 'Green',
          description: 'something about the tea',
          instructions: 'do something with the tea',
          rating: 2
        },
        20: {
          id: 20,
          name: 'Moldy Mushroom',
          teaCategoryId: 3,
          teaCategoryName: 'Pu-ehr',
          description:
            'A woody fermented tea with faint hints of mold and fungus',
          instructions: 'soak then brew',
          rating: 5
        },
        30: {
          id: 30,
          name: 'Earl Grey',
          teaCategoryId: 2,
          teaCategoryName: 'Black',
          description: 'flowery tea',
          instructions: 'do something with the tea',
          rating: 3
        },
        40: {
          id: 40,
          name: 'English Breakfast',
          teaCategoryId: 2,
          teaCategoryName: 'Black',
          description: 'Good basic tea',
          instructions: 'brew it hot',
          rating: 4
        },
        1138: {
          id: 1138,
          name: 'Simple Sencha',
          teaCategoryId: 1,
          teaCategoryName: 'Green',
          description: 'Just a good basic green tea',
          instructions: 'do not over-brew',
          rating: 4
        }
      });
    });

    it('replaces any existing tea list', () => {
      const state = {
        list: [{ id: 42, name: 'incomplete tea' }],
        hash: { 42: { id: 42, name: 'incomplete tea' } }
      };
      mutations.load(state, testData);
      expect(state.list).to.deep.equal(testData);
    });

    it('replaces any existing tea hash', () => {
      const state = {
        list: [{ id: 42, name: 'incomplete tea' }],
        hash: { 42: { id: 42, name: 'incomplete tea' } }
      };
      mutations.load(state, testData);
      expect(state.hash).to.deep.equal({
        10: {
          id: 10,
          name: 'Grassy Green',
          teaCategoryId: 1,
          teaCategoryName: 'Green',
          description: 'something about the tea',
          instructions: 'do something with the tea',
          rating: 2
        },
        20: {
          id: 20,
          name: 'Moldy Mushroom',
          teaCategoryId: 3,
          teaCategoryName: 'Pu-ehr',
          description:
            'A woody fermented tea with faint hints of mold and fungus',
          instructions: 'soak then brew',
          rating: 5
        },
        30: {
          id: 30,
          name: 'Earl Grey',
          teaCategoryId: 2,
          teaCategoryName: 'Black',
          description: 'flowery tea',
          instructions: 'do something with the tea',
          rating: 3
        },
        40: {
          id: 40,
          name: 'English Breakfast',
          teaCategoryId: 2,
          teaCategoryName: 'Black',
          description: 'Good basic tea',
          instructions: 'brew it hot',
          rating: 4
        },
        1138: {
          id: 1138,
          name: 'Simple Sencha',
          teaCategoryId: 1,
          teaCategoryName: 'Green',
          description: 'Just a good basic green tea',
          instructions: 'do not over-brew',
          rating: 4
        }
      });
    });
  });

  describe('remove', () => {
    let state;
    beforeEach(() => {
      state = { };
      mutations.load(state, testData);
    });

    it('removes the tea from the list', () => {
      mutations.remove(state, {id: 20});
      expect(state.list).to.deep.equal([
        {
          id: 10,
          name: 'Grassy Green',
          teaCategoryId: 1,
          teaCategoryName: 'Green',
          description: 'something about the tea',
          instructions: 'do something with the tea',
          rating: 2
        },
        {
          id: 30,
          name: 'Earl Grey',
          teaCategoryId: 2,
          teaCategoryName: 'Black',
          description: 'flowery tea',
          instructions: 'do something with the tea',
          rating: 3
        },
        {
          id: 40,
          name: 'English Breakfast',
          teaCategoryId: 2,
          teaCategoryName: 'Black',
          description: 'Good basic tea',
          instructions: 'brew it hot',
          rating: 4
        },
        {
          id: 1138,
          name: 'Simple Sencha',
          teaCategoryId: 1,
          teaCategoryName: 'Green',
          description: 'Just a good basic green tea',
          instructions: 'do not over-brew',
          rating: 4
        }
      ]);
    });

    it('removes the tea from the hash', () => {
      mutations.remove(state, {id: 20});
      expect(state.hash).to.deep.equal({
        10: {
          id: 10,
          name: 'Grassy Green',
          teaCategoryId: 1,
          teaCategoryName: 'Green',
          description: 'something about the tea',
          instructions: 'do something with the tea',
          rating: 2
        },
        30: {
          id: 30,
          name: 'Earl Grey',
          teaCategoryId: 2,
          teaCategoryName: 'Black',
          description: 'flowery tea',
          instructions: 'do something with the tea',
          rating: 3
        },
        40: {
          id: 40,
          name: 'English Breakfast',
          teaCategoryId: 2,
          teaCategoryName: 'Black',
          description: 'Good basic tea',
          instructions: 'brew it hot',
          rating: 4
        },
        1138: {
          id: 1138,
          name: 'Simple Sencha',
          teaCategoryId: 1,
          teaCategoryName: 'Green',
          description: 'Just a good basic green tea',
          instructions: 'do not over-brew',
          rating: 4
        }
      });
    });
  });

  describe('save', () => {
    let state;
    beforeEach(() => {
      state = { };
      mutations.load(state, testData);
    });

    describe('a new tea', () => {
      it('adds a node to the list', () => {
        mutations.save(state, {
          id: 73,
          name: 'Lipton',
          teaCategoryId: 2,
          teaCategoryName: 'Black',
          description: 'Crappy and acidic',
          instructions: 'brew it hot, then throw it away. Do not drink!!',
          rating: 1
        });
        expect(state.list.length).to.equal(6);
        expect(state.list[5]).to.deep.equal({
          id: 73,
          name: 'Lipton',
          teaCategoryId: 2,
          teaCategoryName: 'Black',
          description: 'Crappy and acidic',
          instructions: 'brew it hot, then throw it away. Do not drink!!',
          rating: 1
        });
      });

      it('adds a node to the hash', () => {
        mutations.save(state, {
          id: 73,
          name: 'Lipton',
          teaCategoryId: 2,
          teaCategoryName: 'Black',
          description: 'Crappy and acidic',
          instructions: 'brew it hot, then throw it away. Do not drink!!',
          rating: 1
        });
        expect(state.hash[73]).to.deep.equal({
          id: 73,
          name: 'Lipton',
          teaCategoryId: 2,
          teaCategoryName: 'Black',
          description: 'Crappy and acidic',
          instructions: 'brew it hot, then throw it away. Do not drink!!',
          rating: 1
        });
      });
    });

    describe('an existing tea', () => {
      it('updates the associated node in the list', () => {
        mutations.save(state, {
          id: 40,
          name: 'British Morning Meal',
          teaCategoryId: 2,
          teaCategoryName: 'Black',
          description: 'Changed name to include whole empire',
          instructions: 'brew it hot',
          rating: 4
        });
        expect(state.list[3]).to.deep.equal({
          id: 40,
          name: 'British Morning Meal',
          teaCategoryId: 2,
          teaCategoryName: 'Black',
          description: 'Changed name to include whole empire',
          instructions: 'brew it hot',
          rating: 4
        });
      });

      it('updates the associated node in the hash', () => {
        mutations.save(state, {
          id: 40,
          name: 'British Morning Meal',
          teaCategoryId: 2,
          teaCategoryName: 'Black',
          description: 'Changed name to include whole empire',
          instructions: 'brew it hot',
          rating: 4
        });
        expect(state.hash[40]).to.deep.equal({
          id: 40,
          name: 'British Morning Meal',
          teaCategoryId: 2,
          teaCategoryName: 'Black',
          description: 'Changed name to include whole empire',
          instructions: 'brew it hot',
          rating: 4
        });
      });
    });
  });

  function initializeTestData() {
    testData = [
      {
        id: 10,
        name: 'Grassy Green',
        teaCategoryId: 1,
        teaCategoryName: 'Green',
        description: 'something about the tea',
        instructions: 'do something with the tea',
        rating: 2
      },
      {
        id: 20,
        name: 'Moldy Mushroom',
        teaCategoryId: 3,
        teaCategoryName: 'Pu-ehr',
        description:
          'A woody fermented tea with faint hints of mold and fungus',
        instructions: 'soak then brew',
        rating: 5
      },
      {
        id: 30,
        name: 'Earl Grey',
        teaCategoryId: 2,
        teaCategoryName: 'Black',
        description: 'flowery tea',
        instructions: 'do something with the tea',
        rating: 3
      },
      {
        id: 40,
        name: 'English Breakfast',
        teaCategoryId: 2,
        teaCategoryName: 'Black',
        description: 'Good basic tea',
        instructions: 'brew it hot',
        rating: 4
      },
      {
        id: 1138,
        name: 'Simple Sencha',
        teaCategoryId: 1,
        teaCategoryName: 'Green',
        description: 'Just a good basic green tea',
        instructions: 'do not over-brew',
        rating: 4
      }
    ];
  }
});
