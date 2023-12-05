// https://velog.io/@typo/advanced-javascript-functions-to-improve-code-quality#%EB%A7%88%EB%AC%B4%EB%A6%AC

export function copy(obj) {
  if (typeof obj !== "object" || obj === null) {
    return;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => copy(item));
  }

  let clone = {};
  for (let key in obj) {
    clone[key] = copy(obj[key]);
  }
  return clone;
}

export function sum(arr) {
  if (!Array.isArray(arr)) {
    return;
  }
  // return arr.reduce((accum, value) => accum + value, 0);

  // Only number
  return arr.reduce((accum, value) => {
    return typeof value === "number" ? accum + value : accum;
  }, 0);
}

export const debounce = function (func, delay) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
};

export const throttle = function (func, delay) {
  let wait = false;

  return (...args) => {
    if (wait) {
      return;
    }

    func(...args);
    wait = true;
    setTimeout(() => {
      wait = false;
    }, delay);
  };
};

export function once(func) {
  let ran = false;
  let result;
  return function () {
    if (ran) {
      return result;
    }
    result = func.apply(this, arguments);
    ran = true;
    return result;
  };
}

export function memoize(func) {
  const cache = new Map();
  return function () {
    const key = JSON.stringify(arguments);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func.apply(this, arguments);
    cache.set(key, result);
    return result;
  };
}

export function curry(func, arity = func.length) {
  return function curried(...args) {
    if (args.length >= arity) {
      return func(...args);
    }

    return function (...moreArgs) {
      return curried(...args, ...moreArgs);
    };
  };
}

export function partial(func, ...args) {
  return function partiallyApplied(...moreArgs) {
    return func(...args, ...moreArgs);
  };
}

export function pipe(...funcs) {
  return function piped(...args) {
    return funcs.reduce((result, func) => [func.call(this, ...result)], args)[0];
  };
}

export function compose(...funcs) {
  return function composed(...args) {
    return funcs.reduceRight((result, func) => [func.call(this, ...result)], args)[0];
  };
}

export function pick(obj, keys) {
  return keys.reduce((acc, key) => {
    if (obj.hasOwnProperty(key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}

export function omit(obj, keys) {
  return Object.keys(obj)
    .filter((key) => !keys.includes(key))
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
}

export function zip(...arrays) {
  const maxLength = Math.max(...arrays.map((array) => array.length));
  return Array.from({ length: maxLength }).map((_, i) => {
    return Array.from({ length: arrays.length }, (_, j) => arrays[j][i]);
  });
}
