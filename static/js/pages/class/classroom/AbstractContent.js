import { ContentHeader } from "./ContentHeader";

export class AbstractContent {
  constructor() {
    this.isActive = false;
    this.prefixCls = "classroom-content";
  }

  createHeader({ parent, title }) {
    return new ContentHeader({ parent: parent, title: title });
  }

  getElement() {
    return this.elThis;
  }

  activate(context = {}) {
    this.elThis?.classList.remove("hidden");
    this.isActive = true;
  }

  deactivate(context = {}) {
    this.elThis?.classList.add("hidden");
    this.isActive = false;
  }
}
