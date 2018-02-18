'use strict';

import Vue from 'vue';
import purchaseLinks from '@/api/purchase-links';
import mockHttp from '../../mock-http';

describe('tea purchase links API', () => {
  let testData;
  beforeEach(() => {
    mockHttp.initialize();
    initiailzeTestData();
    mockHttp.setResponse('/api/teas/10/links', {
      status: 200,
      body: testData.filter(t => t.teaId === 10)
    });
  });

  afterEach(() => {
    mockHttp.restore();
  });

  it('exists', () => {
    expect(purchaseLinks).to.exist;
  });

  describe('get all', () => {
    it('gets data from the links endpoint for the specified tea', async () => {
      await purchaseLinks.getAll(10);
      expect(Vue.http.get.calledOnce).to.be.true;
      expect(Vue.http.get.calledWith('/api/teas/10/links')).to.be.true;
    });

    it('unpacks the reponse body', async () => {
      const res = await purchaseLinks.getAll(10);
      expect(res).to.deep.equal(testData.filter(t => t.teaId === 10));
    });
  });

  describe('save', () => {
    it('posts new link', async () => {
      mockHttp.setPostResponse('/api/teas/60/links', {
        status: 200,
        body: {}
      });
      await purchaseLinks.save({
        teaId: 60,
        url: 'http://some.otherstore.com/calm',
        price: 17.82
      });
      expect(Vue.http.post.calledOnce).to.be.true;
      expect(
        Vue.http.post.calledWith('/api/teas/60/links', {
          teaId: 60,
          url: 'http://some.otherstore.com/calm',
          price: 17.82
        })
      ).to.be.true;
    });

    it('returns the result of the save', async () => {
      mockHttp.setPostResponse('/api/teas/60/links', {
        status: 200,
        body: {
          id: 1138,
          teaId: 60,
          url: 'http://some.otherstore.com/calm',
          price: 17.82
        }
      });
      const tea = await purchaseLinks.save({
        teaId: 60,
        url: 'http://some.otherstore.com/calm',
        price: 17.82
      });
      expect(tea).to.deep.equal({
        id: 1138,
        teaId: 60,
        url: 'http://some.otherstore.com/calm',
        price: 17.82
      });
    });

    it('posts changes to existing link', async () => {
      mockHttp.setPostResponse('/api/teas/60/links/1138', {
        status: 200,
        body: {}
      });
      await purchaseLinks.save({
        id: 1138,
        teaId: 60,
        url: 'http://some.otherstore.com/calm',
        price: 17.82
      });
      expect(
        Vue.http.post.calledWith('/api/teas/60/links/1138', {
          id: 1138,
          teaId: 60,
          url: 'http://some.otherstore.com/calm',
          price: 17.82
        })
      ).to.be.true;
    });
  });

  describe('delete', async () => {
    beforeEach(() => {
      mockHttp.setDeleteResponse('/api/teas/100/links/42', {
        status: 200,
        body: {}
      });
    });

    it('throws without deleting if the link does not have an ID', async () => {
      try {
        await purchaseLinks.delete({
          teaId: 100,
          url: 'http://some.otherstore.com/calm',
          price: 17.82
        });
        expect(true, 'did not throw').to.be.false;
      } catch (err) {
        expect(Vue.http.delete.called).to.be.false;
        expect(err.toString()).to.equal(
          'Error: attempt to delete link without ID'
        );
      }
    });

    it('removes existing link', async () => {
      await purchaseLinks.delete({
        id: 42,
        teaId: 100,
        url: 'http://some.otherstore.com/calm',
        price: 17.82
      });
      expect(Vue.http.delete.calledOnce).to.be.true;
      expect(Vue.http.delete.calledWith('/api/teas/100/links/42')).to.be.true;
    });

    it('resolves the results of the delete', async () => {
      const res = await purchaseLinks.delete({
        id: 42,
        teaId: 100,
        url: 'http://some.otherstore.com/calm',
        price: 17.82
      });
      expect(res).to.deep.equal({});
    });
  });

  function initiailzeTestData() {
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
  }
});
