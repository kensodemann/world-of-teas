import actions from '@/store/modules/purchase-links/actions';
import links from '@/api/purchase-links';

describe('purchase links action', () => {
  let commit;
  let testLinks;

  beforeEach(() => {
    commit = sinon.stub();
    initializeData();
  });

  describe('refresh', () => {
    beforeEach(() => {
      sinon.stub(links, 'getAll');
      links.getAll
        .withArgs(10)
        .returns(Promise.resolve(testLinks.filter(l => l.teaId === 10)));
    });

    afterEach(() => {
      links.getAll.restore();
    });

    it('gets all of the purchase links', () => {
      actions.load({ commit }, { id: 10, name: 'Some sort of tea' });
      expect(links.getAll.calledOnce).to.be.true;
      expect(links.getAll.calledWith(10)).to.be.true;
    });

    it('commits the links', async () => {
      await actions.load({ commit }, { id: 10, name: 'Some sort of tea' });
      expect(commit.calledOnce).to.be.true;
      expect(commit.calledWith('load', testLinks.filter(l => l.teaId === 10)))
        .to.be.true;
    });
  });

  describe('save', () => {
    beforeEach(() => {
      sinon.stub(links, 'save');
    });

    afterEach(() => {
      links.save.restore();
    });

    it('saves the link', () => {
      actions.save(
        { commit },
        {
          teaId: 70,
          url: 'http://some.oddstore.com/wut',
          price: 17.86
        }
      );
      expect(links.save.calledOnce).to.be.true;
      expect(
        links.save.calledWith({
          teaId: 70,
          url: 'http://some.oddstore.com/wut',
          price: 17.86
        })
      ).to.be.true;
    });

    it('commits the saved link', async () => {
      links.save.returns(
        Promise.resolve({
          id: 420,
          teaId: 70,
          url: 'http://some.oddstore.com/wut',
          price: 17.86
        })
      );
      await actions.save(
        { commit },
        {
          teaId: 70,
          url: 'http://some.oddstore.com/wut',
          price: 17.86
        }
      );
      expect(commit.calledOnce).to.be.true;
      expect(
        commit.calledWith('save', {
          id: 420,
          teaId: 70,
          url: 'http://some.oddstore.com/wut',
          price: 17.86
        })
      ).to.be.true;
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      sinon.stub(links, 'delete');
      links.delete.returns(Promise.resolve({}));
    });

    afterEach(() => {
      links.delete.restore();
    });

    it('deletes the link', () => {
      actions.remove(
        { commit },
        {
          id: 4,
          teaId: 30,
          url: 'http://someother.store.com/geoffsgrass',
          price: 23.95
        }
      );
      expect(links.delete.calledOnce).to.be.true;
      expect(
        links.delete.calledWith({
          id: 4,
          teaId: 30,
          url: 'http://someother.store.com/geoffsgrass',
          price: 23.95
        })
      ).to.be.true;
    });

    it('commits the removal of the link', async () => {
      await actions.remove(
        { commit },
        {
          id: 4,
          teaId: 30,
          url: 'http://someother.store.com/geoffsgrass',
          price: 23.95
        }
      );
      expect(commit.calledOnce).to.be.true;
      expect(
        commit.calledWith('remove', {
          id: 4,
          teaId: 30,
          url: 'http://someother.store.com/geoffsgrass',
          price: 23.95
        })
      ).to.be.true;
    });
  });

  function initializeData() {
    testLinks = [
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
  }
});
