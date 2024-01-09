require("./mtu-hamburger-menu.css");
export class MtuHamburgerMenu {
    constructor(options) {
        this.options = options
        this.elThis = null
        this.create()
    }

    create() {
        let elMenuToggle = document.createElement("div")
        elMenuToggle.setAttribute("id", "menuToggle")

        let elMenuButton = document.createElement("input")
        elMenuButton.setAttribute("type", "checkbox")
        elMenuToggle.appendChild(elMenuButton)

        let elSpan1 = document.createElement("span")
        elMenuToggle.appendChild(elSpan1)
        let elSpan2 = document.createElement("span")
        elMenuToggle.appendChild(elSpan2)
        let elSpan3 = document.createElement("span")
        elMenuToggle.appendChild(elSpan3)

        let elList = document.createElement("ul")
        elList.setAttribute("id", "menu")


        this.options.forEach(element => {
            const elMenu = document.createElement("li")
            const icon = document.createElement("img")
            icon.setAttribute("src", `/static/assets/${element.icon}`)
            const title = document.createElement("p")
            title.innerText = element.text
            elMenu.append(icon, title)
            elMenu.addEventListener('click',element.onClick)
            elList.appendChild(elMenu)
        })

        elMenuToggle.appendChild(elList)
        this.elThis = elMenuToggle

    }
}