/**
 * @fileoverview Check whether the given variable is a string or not.
 */

"use strict";

/**
 * Check whether the given variable is a string or not.
 * If the given variable is a string, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is string?
 * @memberof module:type
 */
function isString(obj) {
  return typeof obj === "string" || obj instanceof String;
}

export default isString;
