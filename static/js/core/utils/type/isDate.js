/**
 * @fileoverview Check whether the given variable is an instance of Date or not.
 */

"use strict";

/**
 * Check whether the given variable is an instance of Date or not.
 * If the given variables is an instance of Date, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is an instance of Date?
 * @memberof module:type
 */
function isDate(obj) {
  return obj instanceof Date;
}

export default isDate;
