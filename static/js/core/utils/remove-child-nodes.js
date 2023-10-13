export const removeChildNodes = (function () {
  return {
    removeAll: function (parent) {
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
    },
  };
})();
