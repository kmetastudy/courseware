require("./mtu-expanding-button.css");
export class MtuExpandingButton {
    constructor(options) {
        this.options = options
        this.elThis = null
        this.create()
    }

    create() {
        var $elButtonList = $(`<div class="btn-expand-list"></div>`)
        this.options.forEach(element => {
            var $elButton = $(`<div class="btn-expand ${element.display}">
                                <img src="/static/assets/${element.icon}"/>
                                <p class="">${element.text}</p>
                            </div>`)

            $elButton.on("click", element.onClick)

            $elButtonList.append($elButton)
        });

        this.elThis = $elButtonList
        
    }
}