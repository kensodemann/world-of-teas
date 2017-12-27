import teaCategories from '@/api/tea-categories';
import testTeaCategories from '@/assets/test-data/tea-categories';

describe('tea-categories', () => {
  it('exists', () => {
    expect(teaCategories).to.exist;
  });

  describe('get all', () => {
    it('gets all of the tea categories', () => {
      return teaCategories.getAll().then(res => {
        expect(res).to.deep.equal(testTeaCategories);
      });
    });
  });
});
