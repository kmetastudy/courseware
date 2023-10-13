import { CourseTableManager } from "./course-table-manager";
// header
// buttons?
export const OverviewManager = function (options = {}) {
  this.options = options;
  this._init();
};

OverviewManager.prototype._init = function () {
  this._create();
  this._initManager();
};

OverviewManager.prototype._create = function () {
  this.elThis = document.createElement("div");
  this.elThis.classList.add("overview-manager");
};

OverviewManager.prototype._initManager = function () {
  this.courseTableManager = new CourseTableManager();
};

OverviewManager.prototype.getElement = function () {
  return this.elThis;
};
