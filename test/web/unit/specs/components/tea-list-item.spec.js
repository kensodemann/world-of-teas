import Component from '@/components/tea-list-item';
import { mountComponent } from '../../util';

describe('tea-list-item Component', async () => {
  let vm;
  beforeEach(async () => {
    vm = await mountComponent(Component, {
      tea: {
        id: 30,
        name: 'Earl Grey',
        teaCategoryId: 2,
        teaCategoryName: 'Black',
        description: 'flowery tea',
        instructions: 'do something with the tea',
        rating: 3,
        url: 'https://www.flower-teas.com/4231415973',
        price: 27.42
      }
    });
  });

  it('exists', () => {
    expect(vm).to.exist;
  });

  it('displays the tea name', () => {
    const lbl = vm.$el.querySelector('.title');
    expect(lbl.textContent).to.equal('Earl Grey');
  });

  it('displays the description', () => {
    const lbl = vm.$el.querySelector('.description');
    expect(lbl.textContent).to.equal('flowery tea');
  });
});
