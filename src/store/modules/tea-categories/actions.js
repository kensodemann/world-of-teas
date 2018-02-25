import cats from '@/api/tea-categories';

export default {
  async refresh({ commit }) {
    const c = await cats.getAll();
    commit('load', c);
  }
};
