let currentObserver = null;

/**
 * debounce
 * @param {Function} callback
 * @returns {Function}
 */
function debounceFrame(callback) {
  let currentCallback = -1;
  return () => {
    cancelAnimationFrame(currentCallback);
    currentCallback = requestAnimationFrame(callback);
  };
}

export const observe = (fn) => {
  currentObserver = debounceFrame(fn);
  fn();
  currentObserver = null;
};

export const observable = (obj) => {
  const observerMap = Object.keys(obj).reduce((map, key) => {
    map[key] = new Set();
    return map;
  }, {});

  function isStateSame(target, name, value) {
    return target[name === value] || JSON.stringify(target[name]) === JSON.stringify(value);
  }

  return new Proxy(obj, {
    get(target, name) {
      observerMap[name] = observerMap[name] || new Set();

      if (currentObserver) {
        observerMap[name].add(currentObserver);
      }

      return target[name];
    },

    set(target, name, value) {
      // if (target[name] === value) return true;
      // if (JSON.stringify(target[name]) === JSON.stringify(value)) return true;
      if (isStateSame(target, name, value)) {
        return true;
      }

      target[name] = value;
      observerMap[name].forEach((fn) => fn());

      return true;
    },
  });
};
