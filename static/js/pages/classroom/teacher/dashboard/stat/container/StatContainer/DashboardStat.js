import Component from "../../core/Component.js";

import DashboardStatView from "./DashboardStatView.js";

export default class DashboardStat extends Component {
  constructor(target, props) {
    super(target, new DashboardStatView(target), props);
  }

  mounted() {}

  setEvent() {}
}
