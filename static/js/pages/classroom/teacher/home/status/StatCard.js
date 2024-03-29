import { createStats } from "../../../components/stat/create-stats";

export class StatCard {
  constructor({ title } = {}) {
    this.title = title;
    this.init();
  }

  init() {
    this.stats = createStats();

    this.create();

    if (this.title) {
      this.setTitle(this.title);
    }
  }

  create() {
    const { Root, Stat, Title, Value, Desc } = this.stats;
    this.elThis = Root({ class: "shadow" });

    this.elContainer = Stat({ class: "place-items-center" });

    this.elThis.append(this.elContainer);

    this.elTitle = Title();
    this.elValue = Value({ class: "text-base" });
    this.elDesc = Desc();

    this.elContainer.append(this.elTitle, this.elValue, this.elDesc);
  }

  render({ title, value, desc } = {}) {
    if (title) {
      this.setTitle(title);
    }

    if (value) {
      this.setValue(value);
    }

    if (desc) {
      this.setDesc(desc);
    }
  }

  setTitle(title) {
    this.elTitle.textContent = title;
  }

  setValue(value) {
    this.elValue.textContent = value;
  }

  setDesc(desc) {
    this.elDesc.textContent = desc;
  }

  getElement() {
    return this.elThis;
  }
}
