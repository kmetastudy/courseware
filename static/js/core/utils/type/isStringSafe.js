/**
 * @fileoverview Check whether the given variable is a string or not. (for multiple frame environments)
 */

"use strict";

/**
 * Check whether the given variable is a string or not.
 * If the given variable is a string, return true.
 * (It is used for multiple frame environments)
 * @param {*} obj - Target for checking
 * @returns {boolean} Is a string?
 * @memberof module:type
 */
function isStringSafe(obj) {
  return Object.prototype.toString.call(obj) === "[object String]";
}

export default isStringSafe;
