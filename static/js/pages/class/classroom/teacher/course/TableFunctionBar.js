import { MtuIcon } from "../../../../core/mtu/icon/mtu-icon";
import elem from "../../../../core/utils/elem/elem";

export class TableFunctionBar {
  constructor() {
    this.placeholder = "Search";
    this.init();
  }

  init() {
    this.create();
    this.initEvents();
  }

  create() {
    this.elThis = elem("header", {
      class: "col-span-12 flex justify-between mb-4 p-1 items-center rounded-lg bg-base-100 gap-2 lg:gap-4",
    });
    //
    this.elButtonContainer = elem("div", { class: "p-2" });
    this.elPlusButton = MtuIcon("plus", { style: { fontSize: "20px" } });
    this.elPlusButton.classList.add("cursor-pointer");
    this.elButtonContainer.append(this.elPlusButton);

    this.elSearch = elem("div");
    this.elSearchInput = elem("input", {
      class: "input input-bordered input-sm rounded-lg max-sm:w-24",
      type: "text",
      placeholder: this.placeholder,
    });
    this.elSearch.append(this.elSearchInput);

    this.elThis.append(this.elButtonContainer, this.elSearch);
  }

  initEvents() {
    this.elPlusButton.addEventListener("click", this.handleClickPlusButton.bind(this));
  }

  handleClickPlusButton(evt) {
    // console.log("");
  }

  getElement() {
    return this.elThis;
  }
}
