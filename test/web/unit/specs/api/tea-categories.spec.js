'use strict';

import Vue from 'vue';
import teaCategories from '@/api/tea-categories';
import testData from '../../test-data';

describe('tea-categories', () => {
  beforeEach(() => {
    testData.initialize();
  });

  afterEach(() => {
    testData.restore();
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
      expect(res).to.deep.equal(testData.teaCategories);
    });
  });
});
