import actions from '@/store/modules/tea-categories/actions';
import cats from '@/api/tea-categories';

describe('tea categories action', () => {
  let commit;
  let testCats;

  beforeEach(() => {
    commit = sinon.stub();
    initializeData();
  });

  describe('refresh', () => {
    beforeEach(() => {
      sinon.stub(cats, 'getAll');
      cats.getAll.returns(Promise.resolve(testCats));
    });

    afterEach(() => {
      cats.getAll.restore();
    });

    it('gets all of the tea categories', () => {
      actions.refresh({ commit });
      expect(cats.getAll.calledOnce).to.be.true;
    });

    it('commits the tea categories', async () => {
      await actions.refresh({ commit });
      expect(commit.calledOnce).to.be.true;
      expect(commit.calledWith('load', testCats)).to.be.true;
    });
  });

  function initializeData() {
    testCats = [
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
