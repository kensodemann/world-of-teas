import Vue from 'vue';
import VueResource from 'vue-resource';
import VueResourceMock from 'vue-resource-mock';
import Page from '@/components/pages/login';

import mockDataService from '../../../../data/mock-data-service';

Vue.use(VueResource);
Vue.use(VueResourceMock, mockDataService);

describe('login.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Page);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.login h1').textContent).to.equal(
      'Login Page is Here'
    );
  });
});
