import Vue from 'vue';

export default {
  async getAll(teaId) {
    const res = await Vue.http.get(`/api/teas/${teaId}/links`);
    return res.body;
  },

  async save(link) {
    const url =
      `/api/teas/${link.teaId}/links` + (link.id ? `/${link.id}` : '');
    const res = await Vue.http.post(url, link);
    return res.body;
  },

  async delete(link) {
    if (!(link && link.id && link.teaId)) {
      return Promise.reject(new Error('attempt to delete link without ID'));
    }
    const url = `/api/teas/${link.teaId}/links/${link.id}`;
    const res = await Vue.http.delete(url);
    return res.body;
  }
};
