// How to get thumbnail
// https://stackoverflow.com/questions/2068344/how-do-i-get-a-youtube-video-thumbnail-from-the-youtube-api
import { mtoSVGBuilder } from "../../core/utils/mto-svg-builder";
require("../../../css/pages/cp/mtm-video-card.css");

export const mtmVideoCard = function (options = {}) {
  this.options = options;
  this.data = {}; // video atom data
  this.type = "video";

  if (Number.isInteger(this.options.index) && this.options.index >= 0) {
    this.index = this.options.index;
  }

  this.setterMap = {
    url: this.setUrl.bind(this),
    time: this.setTime.bind(this),
  };

  this._init();
};

mtmVideoCard.prototype._init = function () {
  this._create();
  this._initEvents();
};

mtmVideoCard.prototype._create = function () {
  this.elThis = document.createElement("div");
  this.elThis.classList.add("mtm-video-card");

  // header
  this.elHeader = document.createElement("div");
  this.elHeader.classList.add("video-card-header");
  this.elThis.appendChild(this.elHeader);

  this.elIndex = document.createElement("button");
  this.elIndex.classList.add("btn-outline-success");
  this.elIndex.classList.add("video-card-button");
  this.elHeader.appendChild(this.elIndex);

  this.elUrl = document.createElement("button");
  this.elUrl.classList.add("btn-outline-success");
  this.elUrl.classList.add("video-card-button");
  this.elHeader.appendChild(this.elUrl);

  this.elTime = document.createElement("button");
  this.elTime.classList.add("btn-outline-success");
  this.elTime.classList.add("video-card-button");
  this.elHeader.appendChild(this.elTime);

  this.elDelete = document.createElement("div");
  this.elHeader.appendChild(this.elDelete);

  const clSvgCreator = new mtoSVGBuilder("default");
  const elDelIcon = clSvgCreator.create("fa-solid fa-xmark");
  this.elDelete.appendChild(elDelIcon);

  this.elBody = document.createElement("div");
  this.elBody.classList.add("video-card-body");
  this.elThis.appendChild(this.elBody);

  this.elThumbnail = document.createElement("img");
  this.elThumbnail.classList.add("video-card-thumbnail");
  this.elBody.appendChild(this.elThumbnail);
};

mtmVideoCard.prototype._initEvents = function () {
  this.elThis.addEventListener("click", this.handleCardClick.bind(this));
  this.elUrl.addEventListener("click", this.handleTitleClick.bind(this));
  // this._initDelConfirm();
};

mtmVideoCard.prototype._initDelConfirm = function () {
  const self = this;
  $(function () {
    $(self.elDelete)
      .jConfirm({
        question: "카드를 삭제하시겠습니까?",
        confirm_text: "예",
        deny_text: "아니요",
      })
      .on(
        "confirm",
        function (e) {
          self.handleCardDelete();
        }.bind(this),
      );
  });
};
// ===================================================================
// ============================= Handler =============================
// ===================================================================
mtmVideoCard.prototype.handleCardClick = function () {
  if (this.options.onCardClick) {
    this.options.onCardClick(this);
  }
};

mtmVideoCard.prototype.handleCardDelete = function () {
  if (this.options.onCardDelete) {
    this.options.onCardDelete(this);
  }
};

mtmVideoCard.prototype.handleTitleClick = function (event) {
  console.log(this.data);
  event.stopPropagation();
  console.log(this.data);
  if (!this.data.title || !this.data.url) {
    return;
  }

  const href = `https://www.youtube.com/watch?v=${this.data.url}`;
  window.open(href, "_blank");
};
// ===============================================================
// ============================= API =============================
// ===============================================================
mtmVideoCard.prototype.setData = function (data) {
  for (let key in data) {
    const value = data[key];
    this.data[key] = value;
  }

  for (let key in data) {
    const value = data[key];
    if (this.setterMap[key]) {
      this.setterMap[key](value);
    }
  }
};

mtmVideoCard.prototype.setUrl = function (url) {
  this.elUrl.innerHTML = url;
  this.setThumbnail(url);
};

mtmVideoCard.prototype.setTime = function (time) {
  this.elTime.innerHTML = time;
};

// TODO
// Thumbnail을 항상 검은 부분 없이, fullsize로 맞추는 방법은?
// https://stackoverflow.com/questions/13220715/removing-black-borders-43-on-youtube-thumbnails
mtmVideoCard.prototype.setThumbnail = function (url) {
  this.elThumbnail.setAttribute(
    "src",
    `https://i.ytimg.com/vi_webp/${url}/sddefault.webp
    `,
  );
};

mtmVideoCard.prototype.setIndex = function (index) {
  if (Number.isInteger(index) && index >= 0) {
    this.index = index;
    this.elIndex.innerHTML = this.index + 1;
  }
};

mtmVideoCard.prototype.getData = function () {
  return this.data;
};

mtmVideoCard.prototype.getType = function () {
  return this.type;
};

mtmVideoCard.prototype.getIndex = function () {
  return this.index;
};

mtmVideoCard.prototype.getRootElement = function () {
  return this.elThis;
};

mtmVideoCard.prototype.select = function () {
  this.elThis.classList.add("selected");
};

mtmVideoCard.prototype.unselect = function () {
  this.elThis.classList.remove("selected");
};

// ===============================================================
// ============================= Tool ============================
// ===============================================================
mtmVideoCard.prototype.resetChildNodes = function (parentNode) {
  while (parentNode.firstChild) {
    parentNode.removeChild(parentNode.lastChild);
  }
};
