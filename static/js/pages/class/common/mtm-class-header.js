import elem from "../../../core/utils/elem/elem";
import { classNames } from "../../../core/utils/class-names";
import { ClassCombobox } from "../components/class-combobox";
export class MtmClassHeader {
  constructor({ data = {}, parent: parentElement, initialId }) {
    this.data = data;
    this.parentElement = parentElement;
    this.currentId = initialId ?? null;
    this.initialValue = initialId ? this.data.find((item) => item.id === initialId).title : null;
    console.log(this.initialValue);

    this.init();
  }

  init() {
    this.comboboxData = this.composeComboboxData(this.data);

    this.elThis = this.create();

    console.log(this.comboboxData);

    this.parentElement ? this.parentElement.append(this.elThis) : null;
  }

  create() {
    const elHeader = elem("div", { class: "mtm-class-header" });

    this.elCombobox = ClassCombobox({ data: this.comboboxData, initialValue: this.initialValue });

    elHeader.append(this.elCombobox);

    return elHeader;
  }

  composeComboboxData(data) {
    return data.map(({ id, title }) => {
      return { label: title, value: title, id, onSelect: this.handleSelect.bind(this, id) };
    });
  }

  createDropdown() {}

  createShortcutButton() {}

  handleSelect(evt, id) {
    console.log(id);
  }
  // util
  getRecentClass(dataArray) {
    //
  }

  getElement() {
    return this.elThis;
  }
}
