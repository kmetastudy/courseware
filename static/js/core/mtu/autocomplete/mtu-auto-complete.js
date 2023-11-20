import { adjustConfig } from "../_util/adjust-config";
import { config } from "./config";

require("./mtu-auto-complete.css");
export class MtuAutoComplete {
  constructor(options = {}) {
    this.options = adjustConfig(config, options);
    this.init();
  }

  init() {
    this.create();
  }

  create() {
    // this.select =
  }
}
