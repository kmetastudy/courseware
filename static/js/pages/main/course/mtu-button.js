export function Button(options) {
    this.options = options
    this.elThis = null

    this.create()
}

Button.prototype.create = function() {
    var $elButton = $(`<button class="${this.options.style}">${this.options.title}</button>`)
    this.elThis = $elButton
}