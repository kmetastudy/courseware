export function createStore() {
  const state = {};
  const listener = {};

  const store = {
    getState(key) {
      return state[key];
    },

    setState(key, newState) {
      if (typeof newState === "object" && newState !== null) {
        state[key] = {
          ...state[key],
          ...newState,
        };
      } else {
        state[key] = newState;
      }

      this.notify();
    },

    subscribe(key, newListener) {
      if (listener[key]) {
        listener[key] = [];
      }

      listener[key].push(newListener);
    },

    unsubscribe(key, targetListener) {
      if (listener[key]) {
        const index = listener[key].indexOf(targetListener);
        if (index !== -1) {
          listener[key].splice(index, 1);
        }
      }
    },

    notify(key) {
      if (listener[key]) {
        listener[key].forEach((targetListener) => targetListener());
      }
    },
  };

  return store;
}
