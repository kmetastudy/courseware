import { debounceFrame } from "../dom";
import { isSame } from "../compare";

function StateManager() {
  const manager = {
    currentStateKey: 0,
    states: [],
    listeners: [],
    // If want to use rerender
    root: null,
    renderCount: 0,
    rootComponent: null,
  };

  function useState(initState) {
    const { currentStateKey: key, states, listeners } = manager;

    if (states.length === key) {
      states.push(initState);
    }

    if (listeners.length === key) {
      listeners.push([]);
    }

    const state = states[key];

    const setState = (newState) => {
      if (isSame(state, newState)) {
        return;
      }

      states[key] = newState;

      _render();
      _notify(key);
    };

    const setListener = (listener) => {
      listeners[key].push(listener);
    };

    manager.currentStateKey += 1;

    return [state, setState, setListener];
  }

  const _notify = (key) => {
    const { listeners } = manager;
    listeners[key].forEach((listener) => listener());
  };

  const _render = debounceFrame(() => {
    const { root, rootComponent } = manager;
    if (!root || !rootComponent) return;
    root.innerHTML = rootComponent();
    manager.currentStateKey = 0;
    manager.renderCount += 1;
  });

  function render(rootComponent, root) {
    manager.root = root;
    manager.rootComponent = rootComponent;
    _render();
  }

  return { useState, render };
}

export const { useState, render } = StateManager();
