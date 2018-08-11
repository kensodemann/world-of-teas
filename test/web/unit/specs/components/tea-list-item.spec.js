import Component from '@/components/tea-list-item';
import { mountComponent } from '../../util';

describe('tea-list-item Component', () => {
  it('exists', () => {
    const vm = mountComponent(Component);
    expect(vm).to.exist;
  });
});
