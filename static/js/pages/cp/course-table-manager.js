import { mtmTabulator } from "../../core/component/mtm-tabulator";

export const CourseTableManager = function (options = {}) {
  this.options = options;
  this.init();
};

CourseTableManager.prototype.init = function () {
  this.tabulator = new mtmTabulator();

  //   this.
};
