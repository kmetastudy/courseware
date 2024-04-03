/**
 * Creates a store object with state management functionality.
 *
 * @returns {Object} The store object.
 */
export function createStore() {
  /**
   * The internal state of the store.
   * @type {Map}
   */
  const state = new Map();

  /**
   * The map of listeners subscribed to state changes.
   * @type {Map}
   */
  const listener = new Map();

  /**
   * The store object with state management functionality.
   * @type {Object}
   */
  const store = {
    /**
     * Retrieves the state value for a given key.
     *
     * @param {string} key - The key of the state value.
     * @returns {*} The state value.
     */
    getState(key) {
      return state.get(key);
    },

    /**
     * Sets the state value for a given key.
     *
     * @param {string} key - The key of the state value.
     * @param {*} newState - The new state value.
     */
    setState(key, newState) {
      // if (typeof newState === "object" && newState !== null) {
      //   const currentState = state.get(key) || {};
      //   const updatedState = { ...currentState, ...newState };
      //   state.set(key, updatedState);
      // } else {
      //   state.set(key, newState);
      // }
      state.set(key, newState);

      this.notify(key);
    },

    /**
     * Subscribes a listener function to state changes for one or more keys.
     *
     * @param {string|string[]} keys - The key(s) to subscribe to.
     * @param {Function} newListener - The listener function to be called on state changes.
     */
    subscribe(keys, newListener) {
      const keysArray = Array.isArray(keys) ? keys : [keys];
      keysArray.forEach((key) => {
        if (!listener.has(key)) {
          listener.set(key, []);
        }
        listener.get(key).push(newListener);
      });
    },

    /**
     * Unsubscribes a listener function from state changes for a specific key.
     *
     * @param {string} key - The key to unsubscribe from.
     * @param {Function} targetListener - The listener function to be unsubscribed.
     */
    unsubscribe(key, targetListener) {
      if (listener.has(key)) {
        const listeners = listener.get(key);
        const index = listeners.indexOf(targetListener);
        if (index !== -1) {
          listeners.splice(index, 1);
        }
      }
    },

    /**
     * Notifies all subscribed listeners of state changes for one or more keys.
     *
     * @param {string|string[]} keys - The key(s) to notify listeners for.
     */
    notify(keys) {
      const keysArray = Array.isArray(keys) ? keys : [keys];
      const readyKeys = keysArray.filter((key) => state.has(key));
      if (readyKeys.length === keysArray.length) {
        keysArray.forEach((key) => {
          if (listener.has(key)) {
            const listeners = listener.get(key);
            listeners.forEach((targetListener) => targetListener());
          }
        });
      }
    },

    /**
     * Executes an asynchronous action and updates the state with the result.
     *
     * @param {string} key - The key of the state value to be updated.
     * @param {Function} asyncAction - The asynchronous action to be executed.
     */
    executeAsync(key, asyncAction) {
      asyncAction()
        .then((newState) => {
          this.setState(key, newState);
        })
        .catch((error) => {
          console.error("Failed to execute async action:", error);
          // Handle error or set error state here
        });
    },

    hasState(key) {
      return state.has(key);
    },
  };

  return store;
}
