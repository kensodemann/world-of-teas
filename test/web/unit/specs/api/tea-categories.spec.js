import Vue from 'vue';
import VueResource from 'vue-resource';
import VueResourceMock from 'vue-resource-mock';
import teaCategories from '@/api/tea-categories';

import testDataService from '@/assets/test-data/data-service';
import testTeaCategories from '@/assets/test-data/tea-categories';

Vue.use(VueResource);
Vue.use(VueResourceMock, testDataService, { silent: true });

describe('tea-categories', function() {
  it('exists', function() {
    expect(teaCategories).to.exist;
  });

  describe('get all', function() {
    it('gets all of the tea categories', function() {
      return teaCategories.getAll().then(res => {
        expect(res).to.deep.equal(testTeaCategories);
      });
    });
  });
});
