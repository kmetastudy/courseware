import Component from "../../classroom/teacher/stat/core/Component.js";
import {store} from "./Store.js"
import ContentPaginationView from "./ContentPaginationView.js";

export default class ContentPagination extends Component {
    constructor(target, props) {
        super(target, new ContentPaginationView(target), props)
        this._props.currentGroup = Math.floor((this._props.currentPage-1) / this._props.pageItemsPerRow)
    }

    mounted() {
        this.renderPagination()
    }

    setEvent() {
        const {pageClick} = this._props
        this.addEvent('click', '.page-click', ({target}) => {
            pageClick(target.dataset.seq)
        })

        this.addEvent('click', '.prev-btn', () => {
            if(this._props.currentGroup > 0) {
                this._props.currentGroup -= 1;
                this.mounted()
            }
        })
        this.addEvent('click', '.next-btn', () => {
            if(this._props.endPage < this._props.totalPageCount) {
                this._props.currentGroup += 1;
                this.mounted()
            }
        })
    }

    renderPagination() {
        const pagination = document.getElementById('pagination')

        this._props.startPage = this._props.currentGroup * this._props.pageItemsPerRow + 1
        this._props.endPage = Math.min(this._props.startPage + this._props.pageItemsPerRow - 1, this._props.totalPageCount)

        let innerHTML = ``
        if(this._props.totalPageCount <= this._props.pageItemsPerRow) {
            innerHTML += ``
        }
        else if(this._props.currentGroup == 0) {
            innerHTML += `
            <svg class="prev-btn cursor-pointer" style="margin: 0 10px; margin-top:2px;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 15L8 10L13 5" stroke="#c2c2c2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            `
        }
        else if(this._props.currentGroup != 0) {
            innerHTML += `
            <svg class="prev-btn cursor-pointer" style="margin: 0 10px; margin-top:2px;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 15L8 10L13 5" stroke="#737373" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            `
        }

        for(let i = this._props.startPage; i <= this._props.endPage; i++) {
            if(i == this._props.currentPage) {
                innerHTML += `<div data-seq="${i}" class="page-click text-center text-[16px] text-[#3db051] font-bold cursor-pointer" style="width: 22px; height:24px; margin: 0 10px;">${i}</div>`
            } else {
                innerHTML += `<div data-seq="${i}" class="page-click text-center text-[16px] text-[#8c8c8c] cursor-pointer" style="width: 22px; height:24px; margin: 0 10px;">${i}</div>`
            }
        }

        if(this._props.endPage != this._props.totalPageCount) {
            innerHTML += `
            <svg class="next-btn cursor-pointer" style="margin: 0 10px;margin-bottom: -2px;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 15L12 10L7 5" stroke="#737373" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            `
        }

        pagination.innerHTML = innerHTML
    }

}