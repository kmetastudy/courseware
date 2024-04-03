export default class View {
    $target;

    constructor(target) {
        this.$target = target
    }

    template() {
        return ``
    }

    render(state) {
        this.$target.innerHTML = this.template(state);
    }
}
