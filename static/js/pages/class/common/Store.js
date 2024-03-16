class Store {
  constructor() {
    this.state = {};
    this.listeners = {};
  }

  getState(key) {
    return this.state[key];
  }

  setState(key, newState) {
    if (typeof newState === "object" && newState !== null) {
      this.state[key] = {
        ...this.state[key],
        ...newState,
      };
    } else {
      // 원시 값(문자열, 숫자 등)인 경우 직접 할당
      this.state[key] = newState;
    }

    this.notify(key);
  }

  subscribe(key, listener) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    this.listeners[key].push(listener);
  }

  unsubscribe(key, listener) {
    if (this.listeners[key]) {
      const index = this.listeners[key].indexOf(listener);
      if (index !== -1) {
        this.listeners[key].splice(index, 1);
      }
    }
  }

  notify(key) {
    if (this.listeners[key]) {
      this.listeners[key].forEach((listener) => listener());
    }
  }
}

const store = new Store();

export default store;
