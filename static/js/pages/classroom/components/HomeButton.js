import elem from "../../../core/utils/elem/elem";

export class HomeButton {
  constructor({ onClick } = {}) {
    this.onClick = onClick;
    this.init();
  }

  async init() {
    this.create();

    this.initEvents();
  }

  create() {
    this.elThis = elem("a", { class: "btn btn-ghost text-2xl mb-8" }, "Course12");
  }

  initEvents() {
    this.elThis.addEventListener("click", this.handleClick.bind(this));
  }

  handleClick() {
    if (typeof this.onClick === "function") {
      this.onClick();
    }
  }

  getElement() {
    return this.elThis;
  }
}
