import Component from "../../core/Component.js";

import DashboardInfoView from "./DashboardInfoView.js"

export default class DashboardInfo extends Component{
    constructor(target, props) {
        super(target, new DashboardInfoView(target), props)
    }
}