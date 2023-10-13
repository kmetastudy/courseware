// var options = {
//     name: '추가',
//     events: [{eventType:'click', event: function(){}},{eventType:'click', event: function(){}}],
//     id: 'button-id-sample',
// }

require("../../../css/core/ui/mtm-button.css");
/**
 *
 * @param {obejct} options name, [...events(eventType, event)]
 */
export const mtmButton = function (options) {
  this.options = options || {};
  this._init();
};

mtmButton.prototype._init = function () {
  this._initOptions();
  this._create();
  this._initEvents();
  this._initStyles();
};

mtmButton.prototype._initOptions = function () {
  this.options.name = this.options.name || "버튼";
  (this.options.events = this.options.events || [
    {
      eventType: "click",
      event: function () {
        console.log("No current Event");
      },
    },
  ]),
    (this.id = this.options.id || null);
};

mtmButton.prototype._create = function () {
  this.elThis = document.createElement("button");
  this.elThis.setAttribute("type", "button");
  this.elThis.innerHTML = this.options.name;
  this.elThis.classList.add("mtm-button");
  if (this.id) {
    this.elThis.setAttribute("id", this.id);
  }
};

mtmButton.prototype._initEvents = function () {
  this.eventArray = this.options.events;
  this.eventArray.forEach((e) => {
    this.elThis.addEventListener(e.eventType, e.event.bind(this));
  });
};

mtmButton.prototype._initStyles = function () {
  if (!this.options.style) {
    return;
  }
  for (var key in this.options.style) {
    this.setStyle(key, this.options.style[key]);
  }
};

// ===============================================================
// ============================= API =============================
// ===============================================================
mtmButton.prototype.setStyle = function (property, value) {
  this.elThis.style[property] = value;
};

mtmButton.prototype.disable = function (isDisable) {
  if (isDisable) {
    this.elThis.classList.add("disabled");
    this.elThis.disabled = true;
  } else {
    this.elThis.classList.remove("disabled");
    this.elThis.disabled = false;
  }
};

mtmButton.prototype.getRootElement = function () {
  return this.elThis;
};
