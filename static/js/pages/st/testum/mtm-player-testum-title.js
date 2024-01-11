// 이거 하는 일이 너무 없는 거 아냐?
// 이거 하는 일이 너무 없는 거 아냐?
require("../../../../css/pages/st/testum/mtm-player-testum-title.css");
export class mtmPlayerTestumTitle {
  constructor(options) {
    this.id = "id-mtm-player-testum-title-" + mtmPlayerTestumTitle.id++;

    this.elThis = null;
    this.elTitle = null;
    this.options = options;
    if (!this.options) this.options = {};

    if (!this.options.title) this.options.title = "제목 없음";

    this._init();
  }
  _renderLatex(el) {
    renderMathInElement(el, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true },
      ],
      throwOnError: false,
    });
  }
  _init() {
    this.elThis = document.createElement("div");
    this.elThis.classList.add("mtm-player-testum-title");

    this.elThis.setAttribute("id", this.id);
    this.elContainer = document.createElement("div");
    this.elContainer.classList.add("mtm-player-testum-title-container");

    this.elTitle = document.createElement("div");

    const titleIcon = document.createElement("i");
    titleIcon.className = "fa-solid fa-file-signature mtm-player-testum-title-icon";
    this.elTitle.appendChild(titleIcon);

    this.elThis.appendChild(this.elContainer);
    this.elContainer.appendChild(this.elTitle);

    this.setTitle(this.options.title);
  }
  //////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// API ///////////////////////////////////////////
  setTitle(title) {
    if (!title) {
      return;
    }

    if (this.elTitle.lastChild && this.elTitle.lastChild.nodeType === Node.TEXT_NODE) {
      this.elTitle.lastChild.data = title;
    } else {
      const textNode = document.createTextNode(title);
      this.elTitle.appendChild(textNode);
    }

    this._renderLatex(this.elTitle);
  }
}

mtmPlayerTestumTitle.id = 0;
