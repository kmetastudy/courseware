import { mtoSVGBuilder } from "../component/mto-svg-builder";
// import { removeChildNodes } from "../../tools/remove-child-nodes";

require("../../../../css/core/view/ui/context-menu.css");
export const contextMenu = (function () {
  const menuElement = document.createElement("div");
  menuElement.classList.add("context-menu");
  menuElement.setAttribute("id", "contextMenu");
  document.body.appendChild(menuElement);

  const iconCreator = new mtoSVGBuilder("default");
  let itemsObject = {
    create: {
      events: "",
      icon: "",
      label: "",
      element: "",
    },
  };
  function resetItems() {
    removeChildNodes.removeAll(menuElement);
  }

  function resetObject() {
    itemsObject = {};
  }

  function getIcon(className) {
    return iconCreator.create(className);
  }

  function initOffEvent(el) {
    window.addEventListener("click", function (e) {
      if (e.target !== el) {
        contextMenu.close();
      }
    });
  }
  return {
    open: function (x, y, items) {
      resetItems();
      items.forEach((item) => {
        if (item.disable) {
          return;
        }
        const itemElement = document.createElement("div");
        itemElement.classList.add("context-menu-item");

        // icon
        const iconElement = document.createElement("div");
        iconElement.classList.add("context-menu-icon");
        if (item.icon) {
          iconElement.appendChild(getIcon(item.icon));
        }
        itemElement.appendChild(iconElement);

        // name
        const nameElement = document.createElement("span");
        nameElement.classList.add("context-menu-name");
        nameElement.textContent = item.name;
        itemElement.appendChild(nameElement);

        // events
        itemElement.addEventListener("click", item.action);
        menuElement.appendChild(itemElement);
      });

      menuElement.style.display = "block";
      menuElement.style.left = x - menuElement.offsetWidth + "px";
      menuElement.style.top = y + "px";

      // initOffEvent();
    },
    close: function () {
      menuElement.style.display = "none";
    },
  };
})();
