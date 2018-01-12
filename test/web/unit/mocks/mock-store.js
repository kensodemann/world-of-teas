'use strict';

const MockStore = {
  install(Vue) {
    Vue.prototype.$store = {
      commit: () => {},
      dispatch: () => {}
    };
  }
};

export default MockStore;
