import isFunction from "../../utils/type/isFunction";

const useState = (initialValue) => {
  let _value = initialValue;
  let _callback = null;

  const state = () => _value;
  const setState = (newValue, callback) => {
    _value = newValue;
    _callback = callback;

    if (callback && isFunction(callback)) {
      callback();
    }
  };

  return [state, setState];
};

export default useState;
