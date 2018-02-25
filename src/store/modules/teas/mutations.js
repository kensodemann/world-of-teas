export default {
  load(state, data) {
    state.list = data;
    state.hash = hash(data);
  },

  remove(state, data) {
    const { id } = data;
    if (id) {
      const idx = state.list.findIndex(element => element.id === id);
      if (idx > -1) {
        state.list.splice(idx, 1);
      }
      delete state.hash[id];
    }
  },

  save(state, data) {
    const { id } = data;
    if (id) {
      const idx = state.list.findIndex(element => element.id === id);
      if (idx > -1) {
        state.list.splice(idx, 1, data);
        state.hash[id] = data;
      } else {
        state.list.push(data);
        state.hash[id] = data;
      }
    }
  }
};

function hash(data) {
  let obj = {};
  data.forEach(element => {
    obj[element.id] = element;
  });
  return obj;
}
