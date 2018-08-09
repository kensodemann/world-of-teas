'use strict';

import Page from '@/components/pages/home';
import { mountComponent } from '../../../util';

describe('home.vue', () => {
  it('has the correct title', async () => {
    const vm = await mountComponent(Page);
    expect(vm.$el.querySelector('.home .page-title').textContent).to.equal(
      'Find Great Tea'
    );
  });
});
