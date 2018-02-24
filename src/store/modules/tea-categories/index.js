import actions from './actions';
import mutations from './mutations';

const state = {
  list: [],
  hash: {}
};

export default {
  actions,
  mutations,
  state,
  namespaced: true
};
