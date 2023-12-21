import isFunction from "../../../utils/type/isFunction";

export default function useSyncState(defaultState, onChange) {
  function setState(updater) {
    const newValue = isFunction(updater) ? updater(current) : updater;
    if (newValue !== current) {
      onChange(newValue, current);
    }

    current = newValue;
  }
}
