export class Model {
  #state;

  constructor(state) {
    this.#state = state;
  }

  setState(newState) {
    this.#state = { ...this.#state, ...newState };
  }

  getState = (key) => this.#state[key];

  get = () => this.#state;
}
