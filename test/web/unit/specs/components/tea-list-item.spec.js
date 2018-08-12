import Component from '@/components/tea-list-item';
import { mountComponent } from '../../util';

describe('tea-list-item Component', async () => {
  let vm;
  beforeEach(async () => {
    vm = await mountComponent(Component);
  });

  it('exists', () => {
    expect(vm).to.exist;
  });

  it('displays the tea name', async () => {
    vm.tea = vm.$store.state.teas.hash[30];
    const lbl = vm.$el.querySelector('.title');
    await vm.$nextTick();
    expect(lbl.textContent).to.equal(vm.$store.state.teas.hash[30].name);
  });

  it('displays the rating', () => {});

  it('displays the description', () => {});

  // async function setInput(vm, id, value) {
  //   const inp = vm.$el.querySelector(id);
  //   inp.value = value;
  //   inp.dispatchEvent(new Event('input'));
  //   await Vue.nextTick();
  // }

  // async function setSelect(vm, id, idx) {
  //   const sel = vm.$el.querySelector(id);
  //   sel.selectedIndex = idx;
  //   sel.dispatchEvent(new Event('change'));
  //   await Vue.nextTick();
  // }

  // function getSelectIndex(vm, id) {
  //   const sel = vm.$el.querySelector(id);
  //   return sel.selectedIndex;
  // }
});
