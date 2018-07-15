'use strict';

import Component from '@/components/main-footer';
import moment from 'moment';
import version from '@/assets/version.json';
import {mountComponent} from '../../util';

describe('main-footer.vue', () => {
  it('should render the title line correctly', () => {
    const vm = mountComponent(Component);
    const text = vm.$el.querySelector('.footer-title').textContent;
    expect(text).to.equal(
      `World of Teas - v${version.version} (${version.name})`
    );
  });

  it('should render the copyright line correctly', () => {
    const vm = mountComponent(Component);
    const text = vm.$el.querySelector('.footer-copyright').textContent;
    expect(text).to.equal(
      `Copyright © ${moment(version.date).format('YYYY')} - Kenneth W. Sodemann`
    );
  });
});
