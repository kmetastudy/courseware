import Component from "../../classroom/teacher/stat/core/Component.js";
import {store} from "./Store.js"
import PaginatedContentView from "./PaginatedContentView.js";

import ContentCard from "./ContentCard.js";
import ContentPagination from "./ContentPagination.js";

export default class PaginatedContent extends Component {
    constructor(target, props) {
        super(target, new PaginatedContentView(target), props)
        this._props.countPerPage = 12
        this._props.pageItemsPerRow = 5
    }

    mounted() {
        const {filteredContents, totalPageCount, currentPage} = this
        const {countPerPage, pageItemsPerRow} = this._props

        const $content = this.$target.querySelector('[data-component="content"]')
        const $pagination = this.$target.querySelector('[data-component="pagination"]')

        new ContentCard($content, {filteredContents, currentPage, countPerPage})
        new ContentPagination($pagination, {totalPageCount, currentPage, pageItemsPerRow, pageClick:this.pageClickHandler})
    }

    setEvent() {
      
    }

    get filteredContents() {
      const {selectedCategory, sections} = store.state

      if(selectedCategory == 0) {
        return sections.reduce((acc, {courses}) => {
          acc.push(courses)
          return acc
        }, []).flat()
      } else {
        return sections[selectedCategory-1].courses
      }
    }

    get totalPageCount() {
      return Math.ceil(this.filteredContents.length / this._props.countPerPage)
    }

    get currentPage() {
      const {currentPage} = store.state
      return currentPage
    }

    pageClickHandler(seq) {
      store.setState({currentPage: seq})
    }

}