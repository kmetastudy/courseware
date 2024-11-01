/**
 * @fileoverview Check whether the given variable is a instance of HTMLNode or not.
 */

"use strict";

/**
 * Check whether the given variable is a instance of HTMLNode or not.
 * If the given variables is a instance of HTMLNode, return true.
 * @param {*} html - Target for checking
 * @returns {boolean} Is HTMLNode ?
 * @memberof module:type
 */
function isHTMLNode(html) {
  if (typeof HTMLElement === "object") {
    return html && (html instanceof HTMLElement || !!html.nodeType);
  }

  return !!(html && html.nodeType);
}

export default isHTMLNode;
