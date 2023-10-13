export let mtmSolutionTextEditor = function (options = {}) {
  this.options = options;

  this.data = { content: "" };

  this.isDataChanged = false; // 내용이 변화했는가?
  this._init();
};

mtmSolutionTextEditor.prototype._init = function () {
  this._create();
  this._initCkEditor();
};

mtmSolutionTextEditor.prototype._create = function () {
  this.elThis = document.createElement("div");
  this.elThis.classList.add("solution-text-editor");

  this.elEditorArea = document.createElement("div");
  this.elEditorArea.classList.add("solution-text-editor-area");
  this.elThis.appendChild(this.elEditorArea);

  this.elEditor = document.createElement("div");
  this.elEditor.classList.add("solution-text-editor-main");
  this.elEditorArea.appendChild(this.elEditor);
};

mtmSolutionTextEditor.prototype._initCkEditor = function () {
  this.editor = ClassicEditor.create(this.elEditor)
    .then((editor) => {
      this.editor = editor;
      editor.model.document.on("change:data", (evt, data) => {
        let contentData = editor.getData();
        if (!this.options.onDataChange) {
          return;
        }
        if (contentData !== this.data.content) {
          this.options.onDataChange(true);
        } else {
          this.options.onDataChange(false);
        }
      });
    })
    .catch((error) => {
      console.error(error);
    });
};

// ===============================================================
// ============================= API =============================
// ===============================================================
mtmSolutionTextEditor.prototype.getData = function () {
  this.saveData();
  return this.data.content;
};

mtmSolutionTextEditor.prototype.setData = function (data = {}) {
  this.resetData();
  // 일단 content만 있으니 이렇게 하자.
  // 만약 추가되는게 있으면 추후에 분리하자.
  if (data.content) {
    this.data.content = data.content;
    this.editor.setData(data.content);
  }
};

mtmSolutionTextEditor.prototype.saveData = function () {
  const savedData = this.editor.getData();
  this.data.content = savedData;
};

mtmSolutionTextEditor.prototype.resetData = function () {
  this.data.content = "";
  this.editor.setData("");
};
