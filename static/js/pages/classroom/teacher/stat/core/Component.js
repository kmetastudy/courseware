import { observe } from "./Observer.js";

export default class Component {
    $target;
    _view;
    _model;
    _props;

    constructor(target, view, props = {}) {
        this.$target = target;
        this._view = view;
        this._props = props;

        this.setup();
        this.setEvent();
        // this.render(this._props);
    }

    async setup() {
        await this.initState()
        observe(() => { // state가 변결될 경우, 함수가 실행된다.
            console.log(this)
            this.render(this._props);
            this.mounted();
        })
    }

    async initState() {}


    render(state) {
        this._view.render(state);
    }

    // 모든 이벤트를 this.$target에 등록하여 사용
    setEvent() {}

    mounted() {}

// ----------------utils-------------------
    addEvent(eventType, selector, callback) {
        // const children = [ ...this.$target.querySelectorAll(selector) ];
        this.$target.addEventListener(eventType, event => {
            if(!event.target.closest(selector)) return false;
            callback(event);
        })
    }
}