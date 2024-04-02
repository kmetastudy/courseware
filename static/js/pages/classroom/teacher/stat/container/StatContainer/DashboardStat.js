import Component from "../../core/Component.js";

import DashboardStatView from "./DashboardStatView.js";

export default class DashboardStat extends Component {
  constructor(target, props) {
    super(target, new DashboardStatView(target), props);
  }

  mounted() {
    // const {selectedClass} = this._props
    // this.$target.querySelectorAll("select[name=class] option")[selectedClass].selected = true;
  }

  setEvent() {
    // const {selectClassListener} = this._props
    // this.addEvent('change', '.select', ({target}) => {
    //     selectClassListener(target.value)
    // })
  }
}
