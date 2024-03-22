/**
 * Same with createStore, but handling data
 * Also use Map instead of Object.
 */
export function createRepository() {
  let data = new Map();
  let listener = new Map();

  const repository = {
    getData(key) {
      return data.get(key);
    },

    setData(key, newData) {
      if (typeof newData === "object" && newData !== null) {
        data.set(key, {
          ...data.get(key),
          ...newData,
        });
      }

      this.notify(key);
    },

    updateData(key, nextData) {
      if (!this.hasData(key)) {
        this.setData(key, nextData);
      }
    },

    subscribe(key, callback) {
      if (!this.hasListener(key)) {
        listener.set(key, []);
      }

      listener.get(key).push(callback);
    },

    unsubscribe(key, targetListener) {
      if (this.hasListener(key)) {
        const index = listener.get(key).indexOf(targetListener);
        if (index !== -1) {
          listener.get(key).splice(index, 1);
        }
      }
    },

    notify(key) {
      if (this.hasListener(key)) {
        listener.get(key).forEach((targetListener) => targetListener());
      }
    },

    hasData(key) {
      return data.has(key);
    },

    hasListener(key) {
      return listener.has(key);
    },

    getDataKeys() {
      return data.keys();
    },

    getListenerKeys() {
      return listener.keys();
    },
  };

  return repository;
}
