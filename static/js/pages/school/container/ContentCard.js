import Component from "../../classroom/teacher/stat/core/Component.js";
import {store} from "./Store.js"
import ContentCardView from "./ContentCardView.js";

export default class ContentCard extends Component {
    constructor(target, props) {
        super(target, new ContentCardView(target), props)
    }

    mounted() {
        
    }

    setEvent() {
      
    }


}