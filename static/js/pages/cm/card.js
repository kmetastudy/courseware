// require("../css/card.css");
export const Card = function (options = {}) {
  this.options = options;
  this._init();
};

Card.prototype._init = function () {
  this._create();
};

Card.prototype._create = function () {
  this.elCard = document.createElement("div");
  this.elCard.classList.add("card");

  this.elHeader = document.createElement("div");
  this.elHeader.classList.add("card-header");
  this.elHeader.innerHTML = "Card";
  this.elCard.appendChild(this.elHeader);

  this.elBody = document.createElement("div");
  this.elBody.classList.add("card-body");
  this.elCard.appendChild(this.elBody);
};

// ============================= API =============================
Card.prototype.getRootElement = function () {
  return this.elCard;
};

Card.prototype.setData = function (data) {
  this.resetChildNodes(this.elBody);
  this.elBody.innerHTML = data;
  this.renderLatex(this.elBody);
};

Card.prototype.reset = function () {
  this.resetChildNodes(this.elBody);
};
// ============================= TOOL =============================
Card.prototype.renderLatex = function (el) {
  renderMathInElement(el, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true },
    ],
  });
};

Card.prototype.resetChildNodes = function (parentNode) {
  while (parentNode.firstChild) {
    parentNode.removeChild(parentNode.lastChild);
  }
};
