import actions from '@/store/modules/teas/actions';
import teas from '@/api/teas';

describe('teas action', () => {
  let commit;
  let testTeas;

  beforeEach(() => {
    commit = sinon.stub();
    initializeData();
  });

  describe('refresh', () => {
    beforeEach(() => {
      sinon.stub(teas, 'getAll');
      teas.getAll.returns(Promise.resolve(testTeas));
    });

    afterEach(() => {
      teas.getAll.restore();
    });

    it('gets all of the teas', () => {
      actions.refresh({ commit });
      expect(teas.getAll.calledOnce).to.be.true;
    });

    it('commits the teas', async () => {
      await actions.refresh({ commit });
      expect(commit.calledOnce).to.be.true;
      expect(commit.calledWith('load', testTeas)).to.be.true;
    });
  });

  describe('save', () => {
    beforeEach(() => {
      sinon.stub(teas, 'save');
    });

    afterEach(() => {
      teas.save.restore();
    });

    it('saves the tea', () => {
      actions.save(
        { commit },
        {
          name: 'Black Beard',
          teaCategoryId: 2,
          teaCategoryName: 'Black',
          description: 'arrg, this tea be for pirates',
          instructions: 'heat it up and mix it with rum',
          rating: 4
        }
      );
      expect(teas.save.calledOnce).to.be.true;
      expect(
        teas.save.calledWith({
          name: 'Black Beard',
          teaCategoryId: 2,
          teaCategoryName: 'Black',
          description: 'arrg, this tea be for pirates',
          instructions: 'heat it up and mix it with rum',
          rating: 4
        })
      ).to.be.true;
    });

    it('commits the saved tea', async () => {
      teas.save.returns(
        Promise.resolve({
          id: 42,
          name: 'Black Beard',
          teaCategoryId: 2,
          teaCategoryName: 'Black',
          description: 'arrg, this tea be for pirates',
          instructions: 'heat it up and mix it with rum',
          rating: 4
        })
      );
      await actions.save(
        { commit },
        {
          name: 'Black Beard',
          teaCategoryId: 2,
          teaCategoryName: 'Black',
          description: 'arrg, this tea be for pirates',
          instructions: 'heat it up and mix it with rum',
          rating: 4
        }
      );
      expect(commit.calledOnce).to.be.true;
      expect(
        commit.calledWith('save', {
          id: 42,
          name: 'Black Beard',
          teaCategoryId: 2,
          teaCategoryName: 'Black',
          description: 'arrg, this tea be for pirates',
          instructions: 'heat it up and mix it with rum',
          rating: 4
        })
      ).to.be.true;
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      sinon.stub(teas, 'delete');
      teas.delete.returns(Promise.resolve({}));
    });

    afterEach(() => {
      teas.delete.restore();
    });

    it('deletes the tea', () => {
      actions.remove(
        { commit },
        {
          id: 42,
          name: 'Black Beard',
          teaCategoryId: 2,
          teaCategoryName: 'Black',
          description: 'arrg, this tea be for pirates',
          instructions: 'heat it up and mix it with rum',
          rating: 4
        }
      );
      expect(teas.delete.calledOnce).to.be.true;
      expect(
        teas.delete.calledWith({
          id: 42,
          name: 'Black Beard',
          teaCategoryId: 2,
          teaCategoryName: 'Black',
          description: 'arrg, this tea be for pirates',
          instructions: 'heat it up and mix it with rum',
          rating: 4
        })
      ).to.be.true;
    });

    it('commits the removal of the tea', async () => {
      await actions.remove(
        { commit },
        {
          id: 42,
          name: 'Black Beard',
          teaCategoryId: 2,
          teaCategoryName: 'Black',
          description: 'arrg, this tea be for pirates',
          instructions: 'heat it up and mix it with rum',
          rating: 4
        }
      );
      expect(commit.calledOnce).to.be.true;
      expect(
        commit.calledWith('remove', {
          id: 42,
          name: 'Black Beard',
          teaCategoryId: 2,
          teaCategoryName: 'Black',
          description: 'arrg, this tea be for pirates',
          instructions: 'heat it up and mix it with rum',
          rating: 4
        })
      ).to.be.true;
    });
  });

  function initializeData() {
    testTeas = [
      {
        id: 10,
        name: 'Grassy Green',
        teaCategoryId: 1,
        teaCategoryName: 'Green',
        description: 'something about the tea',
        instructions: 'do something with the tea',
        rating: 2,
        url: 'https://www.myteas.com/green/grassy/42',
        price: 35.99
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
      }
    ];
  }
});
