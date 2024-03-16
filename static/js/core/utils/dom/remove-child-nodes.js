import { isHTMLNode } from "../type";

export const removeChildNodes = function (parent) {
  if (!isHTMLNode(parent)) {
    return;
  }

  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};
