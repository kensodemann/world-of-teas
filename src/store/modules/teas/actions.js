import teas from '@/api/teas';

export default {
  async refresh({ commit }) {
    const t = await teas.getAll();
    commit('load', t);
  },

  async save({ commit }, tea) {
    const t = await teas.save(tea);
    commit('save', t);
  },

  async remove({ commit }, tea) {
    await teas.delete(tea);
    commit('remove', tea);
  }
};
