export default {
  load: (state, links) => {
    state.teas = hash(state.teas, links);
  },

  remove(state, link) {
    const links = state.teas[link.teaId];
    if (links) {
      const idx = links.findIndex(l => l.id === link.id);
      if (idx > -1) {
        links.splice(idx, 1);
        if (!links.length) {
          delete state.teas[link.teaId];
        }
      }
    }
  },

  save(state, link) {
    if (!state.teas[link.teaId]) {
      state.teas[link.teaId] = [];
    }
    const links = state.teas[link.teaId];
    const idx = links.findIndex(l => l.id === link.id);
    if (idx < 0) {
      links.push(link);
    } else {
      links.splice(idx, 1, link);
    }
  }
};

function hash(hash, data) {
  const newHash = {};
  data.forEach(element => {
    if (!newHash[element.teaId]) {
      newHash[element.teaId] = [];
    }
    newHash[element.teaId].push(element);
  });
  return Object.assign({}, hash, newHash);
}
