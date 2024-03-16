import elem from "../../../core/utils/elem/elem";

export class Table {
  constructor() {
    this.init();
  }

  init() {
    this.elThis = elem("div", { class: "overflow-x-auto" });
    this.elTable = elem("table", { class: "table" });

    this.elHead = elem("thead");
    this.elBody = elem("tbody");

    this.elThis.append(this.elTable);
    this.elTable.append(this.elBody);
  }

  //
}

var template = {
  columns: [1, 2, 3, 4, 5],
};
