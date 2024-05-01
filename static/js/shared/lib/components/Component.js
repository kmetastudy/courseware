import { observable, observe } from "./observer.js";

export class Component {
  state;
  props;
  $target;
  $model;

  constructor({ target, props, model }) {
    this.$target = target;
    this.$model = model;
    this.props = props;

    this.setup();
  }

  setup() {
    this.state = observable(this.initState());

    observe(() => {
      this.render();
      this.setEvent();
      this.mounted();
    });
  }

  initState() {
    return {};
  }

  template() {
    return "";
  }

  render() {
    this.$target.innerHTML = this.template();
  }

  setEvent() {}

  /**
   * This is for the lifecycle method that is called after render.
   */
  mounted() {}
}
