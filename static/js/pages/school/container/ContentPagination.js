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

        this.addEvent('click', '.prev-btn', () => {
            if(Number(this._props.currentPage) != 1)
            pageClick(Number(this._props.currentPage)-1)
        })
        this.addEvent('click', '.next-btn', () => {
            if(Number(this._props.currentPage) != this._props.totalPageCount)
            pageClick(Number(this._props.currentPage)+1)
        })
    }

}