require("../../../../css/core/ui/form/mtu-form.css");
import { type } from "../type";
export const mtuForm = function (options = {}) {
  this.options = options;
  this._init();
};

mtuForm.prototype._initVariable = function () {
  this.name = this.options.name ?? null;
  this.size = this.options.size ?? null;
  this.className = this.options.className ?? "text";
  this.disabled = this.options.disabled ?? false;

  this.onFinish = this.options.onFinish ?? null;
  this.onFinishFailed = this.options.onFinishFailed ?? null;
  this.initialValues = this.options.initialValues ?? null;
};

mtuForm.prototype.create = function (items) {
  //
};
