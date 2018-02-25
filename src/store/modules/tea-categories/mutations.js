export default {
  load(store, data) {
    store.list = data;
    store.hash = hash(data);
  }
};

function hash(data) {
  let obj = {};
  data.forEach(element => {
    obj[element.id] = element;
  });
  return obj;
}
