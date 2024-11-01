/**
 * @fileoverview Check whether the given variable is a number or not.
 */

"use strict";

/**
 * Check whether the given variable is a number or not.
 * If the given variable is a number, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is number?
 * @memberof module:type
 */
function isNumber(obj) {
  return typeof obj === "number" || obj instanceof Number;
}

export default isNumber;
