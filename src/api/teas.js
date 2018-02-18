import Vue from 'vue';

export default {
  async getAll() {
    const res = await Vue.http.get('/api/teas');
    return res.body;
  },

  async save(tea) {
    const url = '/api/teas' + (tea.id ? `/${tea.id}` : '');
    const res = await Vue.http.post(url, tea);
    return res.body;
  },

  async delete(tea) {
    if (!(tea && tea.id)) {
      return Promise.reject(new Error('attempt to delete tea without ID'));
    }

    const url = '/api/teas' + (tea.id ? `/${tea.id}` : '');
    const res = await Vue.http.delete(url);
    return res.body;
  }
};
