import Component from "../../classroom/teacher/stat/core/Component.js";
import {store} from "./Store.js"
import PaginatedContentView from "./PaginatedContentView.js";

import ContentCard from "./ContentCard.js";
import ContentPagination from "./ContentPagination.js";

export default class PaginatedContent extends Component {
    constructor(target, props) {
        super(target, new PaginatedContentView(target), props)
        this._props.count_per_page = 12
    }

    mounted() {
        const {filteredContents, totalPageCount, currentPage} = this
        // console.log(totalPageCount)

        const $content = this.$target.querySelector('[data-component="content"]')
        const $pagination = this.$target.querySelector('[data-component="pagination"]')

        new ContentCard($content, {filteredContents, currentPage, countPerPage:this._props.count_per_page})
        new ContentPagination($pagination, {totalPageCount, currentPage, pageClick:this.pageClickHandler})
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
      return Math.ceil(this.filteredContents.length / this._props.count_per_page)
    }

    get currentPage() {
      const {currentPage} = store.state
      return currentPage
    }

    pageClickHandler(seq) {
      store.setState({currentPage: seq})
    }

}