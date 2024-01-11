require("./mtm-player-lesson-title.css");
// 이거 하는 일이 너무 없는 거 아냐?
// 이거 하는 일이 너무 없는 거 아냐?
export class mtmPlayerLessonTitle {
  constructor(options) {
    this.id = "id-mtm-player-lesson-title-" + mtmPlayerLessonTitle.id++;

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
    this.elThis.setAttribute("id", this.id);
    this.elContainer = document.createElement("div");
    this.elContainer.classList.add("mtm-player-lesson-title-container");

    this.elTitle = document.createElement("div");
    const titleIcon = document.createElement("i");
    titleIcon.className = "fa-brands fa-youtube mtm-player-lesson-title-icon";
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

mtmPlayerLessonTitle.id = 0;
