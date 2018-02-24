import links from '@/api/purchase-links';

export default {
  async load({ commit }, tea) {
    const l = await links.getAll(tea.id);
    commit('load', l);
  },

  async save({ commit }, link) {
    const l = await links.save(link);
    commit('save', l);
  },

  async remove({ commit }, link) {
    await links.delete(link);
    commit('remove', link);
  }
};
