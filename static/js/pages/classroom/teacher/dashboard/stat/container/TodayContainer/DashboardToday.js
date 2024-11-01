import Component from "../../core/Component.js";

import DashboardTodayView from "./DashboardTodayView.js";

export default class DashboardToday extends Component {
  constructor(target, props) {
    super(target, new DashboardTodayView(target), props);
  }

  mounted() {}

  get selectedLesson() {
    const { todayScheduler } = this._props;

    return todayScheduler;
  }
}
