/**
 * @fileoverview Check whether the given variable is an instance of Date or not. (for multiple frame environments)
 */

"use strict";

/**
 * Check whether the given variable is an instance of Date or not.
 * If the given variables is an instance of Date, return true.
 * (It is used for multiple frame environments)
 * @param {*} obj - Target for checking
 * @returns {boolean} Is an instance of Date?
 * @memberof module:type
 */
function isDateSafe(obj) {
  return Object.prototype.toString.call(obj) === "[object Date]";
}

export default isDateSafe;
