import Component from "../../classroom/teacher/stat/core/Component.js";
import {store} from "./Store.js"
import ContentPaginationView from "./ContentPaginationView.js";

export default class ContentPagination extends Component {
    constructor(target, props) {
        super(target, new ContentPaginationView(target), props)
    }

    mounted() {

    }

    setEvent() {
        const {pageClick} = this._props
        this.addEvent('click', '.page-click', ({target}) => {
            pageClick(target.dataset.seq)
        })
    }

}