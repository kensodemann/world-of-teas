'use strict';

import Page from '@/components/pages/home';
import util from '../../../util';

describe('home.vue', () => {
  it('has the correct title', () => {
    const vm = util.mountComponent(Page);
    expect(vm.$el.querySelector('.home .page-title').textContent).to.equal(
      'Find Great Tea'
    );
  });
});
