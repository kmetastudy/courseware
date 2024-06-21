import Component from "../../classroom/teacher/stat/core/Component.js";
import {store} from "./Store.js"
import CategoryPaginatedContentView from "./CategoryPaginatedContentView.js";

import PaginatedContent from "./PaginatedContent.js";

export default class CategoryPaginatedContent extends Component {
    constructor(target, props) {
        super(target, new CategoryPaginatedContentView(target), props)
    }

    async initState() {
      store.setState({sections: this._props.sections})
    }

    mounted() {
        const $paginatedContent = this.$target.querySelector('[data-component="paginatedContent"]')

        new PaginatedContent($paginatedContent, {})
    }

    setEvent() {
      this.addEvent('click', '.category-click', ({target}) => {
        // console.log(target.dataset.seq)
        this.categoryClickHandler(target.dataset.seq)

        let categories = document.querySelectorAll('.category-click')
        categories.forEach((category) => category.classList.remove('text-[#3db051]', 'font-bold'))
        target.classList.add('text-[#3db051]', 'font-bold')
      })
    }

    categoryClickHandler(seq) {
      store.setState({selectedCategory: seq})
      store.setState({currentPage: 1})
    }

}