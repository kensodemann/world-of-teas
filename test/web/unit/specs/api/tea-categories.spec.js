'use strict';

import Vue from 'vue';
import teaCategories from '@/api/tea-categories';
import mockHttp from '../../mock-http';

describe('tea-categories', () => {
  let testData;
  beforeEach(() => {
    mockHttp.initialize();
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
    mockHttp.setResponse('/api/tea-categories', {
      status: 200,
      body: testData
    });
  });

  afterEach(() => {
    mockHttp.restore();
  });

  it('exists', () => {
    expect(teaCategories).to.exist;
  });

  describe('get all', () => {
    it('gets data from the tea-categories endpoint', async () => {
      await teaCategories.getAll();
      expect(Vue.http.get.calledOnce).to.be.true;
      expect(Vue.http.get.calledWith('/api/tea-categories')).to.be.true;
    });

    it('unpacks the reponse body', async () => {
      const res = await teaCategories.getAll();
      expect(res).to.deep.equal(testData);
    });
  });
});
