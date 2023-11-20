import { Button } from "./button.js";

// require("../css/editor.css");
export const Editor = function (options = {}) {
  this.options = options;
  this.editor = null
  this._init();
};

Editor.prototype._init = function () {
  this._create();
  this._initCKEditor();
};

Editor.prototype._create = function () {
  this.elWrapper = document.createElement("div");
  this.elWrapper.classList.add("editor-wrapper");

  this.elHeader = document.createElement("div");
  this.elHeader.classList.add("editor-header");
  this.elWrapper.appendChild(this.elHeader);

  this.elEditor = document.createElement("div");
  this.elEditor.classList.add("editor");
  this.elWrapper.appendChild(this.elEditor);

  // Button
  // const saveOption = {
  //   onButtonClick: this.handleSaveButtonClick.bind(this),
  // };
  // this.saveButton = new Button("save", saveOption);
  // this.elSaveButton = this.saveButton.getRootElement();
  // this.elHeader.appendChild(this.elSaveButton);
  // const resetOption = {
  //   onButtonClick: this.handleResetButtonClick.bind(this),
  // };
  // this.resetButton = new Button("reset", resetOption);
  // this.elResetButton = this.resetButton.getRootElement();
  // this.elHeader.appendChild(this.elResetButton);
};

// ============================= Handler =============================
Editor.prototype.handleSaveButtonClick = function () {
  const data = this.get();
  if (this.options.onEditorSave) {
    this.options.onEditorSave(data);
  }
};

Editor.prototype.handleResetButtonClick = function () {
  this.reset();
};

// ============================= API =============================
Editor.prototype._initCKEditor = function () {
  var self = this
  ClassicEditor.create(this.elEditor)
    .then((editor) => {
      self.editor = editor;
      self.editor.model.document.on("change:data", self.changeEditor.bind(self));
    })
    .catch((error) => {
      console.error(error);
    });

  console.log("Editor.js > activate: initialize done");
};

Editor.prototype.changeEditor = function() {
  var data = this.editor.getData()
  this.options.onEditorDataChange(data)
}

Editor.prototype.getRootElement = function () {
  return this.elWrapper;
};


Editor.prototype.get = function () {
  return this.editor.getData();
};

Editor.prototype.setData = function (data) {
  this.editor.setData(data);
};

Editor.prototype.reset = function () {
  // Default value is "", not null
  this.setData("");
};
