/**
 * @fileoverview Check whether the given variable is falsy or not.
 */

"use strict";

import isTruthy from "./isTruthy";

/**
 * Check whether the given variable is falsy or not.
 * If the given variable is null or undefined or false, returns true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is falsy?
 * @memberof module:type
 */
function isFalsy(obj) {
  return !isTruthy(obj);
}

export default isFalsy;
