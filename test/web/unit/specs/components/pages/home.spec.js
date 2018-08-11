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

  describe('teas', () => {
    it('contains all of the teas by default', async () => {
      const vm = await mountComponent(Page);
      expect(vm.teas.length).to.equal(vm.$store.state.teas.list.length);
    });
  });
});
