export const mtoValidator = (function () {
  return {
    isDom: function (element) {
      if (typeof HTMLElement !== "undefined" && element instanceof Element) {
        return true;
      } else if (typeof element === "string") {
        const domElement = document.querySelector(element);

        if (domElement) {
          return true;
        } else {
          console.error("Creation Error - no element found matching selector: ", element);
          return false;
        }
      } else {
        console.error("Creation Error - Invalid element provided:", element);
        return false;
      }
    },
  };
})();
