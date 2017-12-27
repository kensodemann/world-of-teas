'use strict';

const MockRouter = {
  install(Vue) {
    Vue.prototype.$router = {
      push: () => {},
      replace: () => {}
    };
  }
};

export default MockRouter;
