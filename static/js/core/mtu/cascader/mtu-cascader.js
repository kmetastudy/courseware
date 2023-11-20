import { config } from "./config";
import { adjustConfig } from "../_util/adjust-config";
require("./mtu-cascader.css");
export class MtuCascader {
  constructor(options) {
    this.options = adjustConfig(config, options);

    this.init();
  }
}
