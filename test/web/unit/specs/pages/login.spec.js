import Vue from 'vue';
import VueResource from 'vue-resource';
import Page from '@/components/pages/login';

Vue.use(VueResource);

// This is just one way of doing this, and very very simple. Other options that may come in handy:
// https://matthiashager.com/blog/mocking-http-requests-with-vuejs
// https://www.npmjs.com/package/vue-resource-mock
// https://www.npmjs.com/package/vue-resource-mock-api
// The last two may be especially interesting for the e2e tests where we want mock data and want mock
// operations but do not want to change the database (same here, but may be more easily able to handle on
// a case-by-case basis as noted in the first link)
Vue.http.interceptors.unshift((request, next) => {
  next(
    request.respondWith(
      {
        id: 17,
        body: 'Well, my time of not taking you seriously is coming to a middle.'
      },
      { status: 200 }
    )
  );
});

describe('login.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Page);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.login h1').textContent).to.equal(
      'Login Page is Here'
    );
  });
});
