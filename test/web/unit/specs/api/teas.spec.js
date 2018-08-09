'use strict';

import Vue from 'vue';
import teas from '@/api/teas';
import mockHttp from './mock-http';

describe('teas', () => {
  let testData;
  beforeEach(() => {
    mockHttp.initialize();
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
    mockHttp.setResponse('/api/teas', {
      status: 200,
      body: testData
    });
  });

  afterEach(() => {
    mockHttp.restore();
  });

  it('exists', () => {
    expect(teas).to.exist;
  });

  describe('get all', () => {
    it('gets data from the teas endpoint', async () => {
      await teas.getAll();
      expect(Vue.http.get.calledOnce).to.be.true;
      expect(Vue.http.get.calledWith('/api/teas')).to.be.true;
    });

    it('unpacks the reponse body', async () => {
      const res = await teas.getAll();
      expect(res).to.deep.equal(testData);
    });
  });

  describe('save', () => {
    it('posts new teas', async () => {
      mockHttp.setPostResponse('/api/teas', {
        status: 200,
        body: {}
      });
      await teas.save({
        name: 'Grassy Green',
        teaCategoryId: 1,
        teaCategoryName: 'Green',
        description: 'something about the tea',
        instructions: 'do something with the tea',
        rating: 2
      });
      expect(Vue.http.post.calledOnce).to.be.true;
      expect(
        Vue.http.post.calledWith('/api/teas', {
          name: 'Grassy Green',
          teaCategoryId: 1,
          teaCategoryName: 'Green',
          description: 'something about the tea',
          instructions: 'do something with the tea',
          rating: 2
        })
      ).to.be.true;
    });

    it('returns the result of the save', async () => {
      mockHttp.setPostResponse('/api/teas', {
        status: 200,
        body: {
          id: 10,
          name: 'Grassy Green',
          teaCategoryId: 1,
          teaCategoryName: 'Green',
          description: 'something about the tea',
          instructions: 'do something with the tea',
          rating: 2
        }
      });
      const tea = await teas.save({
        name: 'Grassy Green',
        teaCategoryId: 1,
        teaCategoryName: 'Green',
        description: 'something about the tea',
        instructions: 'do something with the tea',
        rating: 2
      });
      expect(tea).to.deep.equal({
        id: 10,
        name: 'Grassy Green',
        teaCategoryId: 1,
        teaCategoryName: 'Green',
        description: 'something about the tea',
        instructions: 'do something with the tea',
        rating: 2
      });
    });

    it('posts changes to existing teas', async () => {
      mockHttp.setPostResponse('/api/teas/30', {
        status: 200,
        body: {}
      });
      await teas.save({
        id: 30,
        name: 'Earl Grey',
        teaCategoryId: 2,
        teaCategoryName: 'Black',
        description: 'flowery tea',
        instructions: 'do something with the tea',
        rating: 3
      });
      expect(
        Vue.http.post.calledWith('/api/teas/30', {
          id: 30,
          name: 'Earl Grey',
          teaCategoryId: 2,
          teaCategoryName: 'Black',
          description: 'flowery tea',
          instructions: 'do something with the tea',
          rating: 3
        })
      ).to.be.true;
    });
  });

  describe('delete', async () => {
    beforeEach(() => {
      mockHttp.setDeleteResponse('/api/teas/30', {
        status: 200,
        body: {}
      });
    });

    it('throws without deleting if the tea does not have an ID', async () => {
      try {
        await teas.delete({
          name: 'Earl Grey',
          teaCategoryId: 2,
          teaCategoryName: 'Black',
          description: 'flowery tea',
          instructions: 'do something with the tea',
          rating: 3
        });
        expect(true, 'did not throw').to.be.false;
      } catch (err) {
        expect(Vue.http.delete.called).to.be.false;
        expect(err.toString()).to.equal('Error: attempt to delete tea without ID');
      }
    });

    it('removes existing teas', async () => {
      await teas.delete({
        id: 30,
        name: 'Earl Grey',
        teaCategoryId: 2,
        teaCategoryName: 'Black',
        description: 'flowery tea',
        instructions: 'do something with the tea',
        rating: 3
      });
      expect(Vue.http.delete.calledOnce).to.be.true;
      expect(Vue.http.delete.calledWith('/api/teas/30')).to.be.true;
    });

    it('resolves the results of the delete', async () => {
      const res = await teas.delete({
        id: 30,
        name: 'Earl Grey',
        teaCategoryId: 2,
        teaCategoryName: 'Black',
        description: 'flowery tea',
        instructions: 'do something with the tea',
        rating: 3
      });
      expect(res).to.deep.equal({});
    });
  });
});
