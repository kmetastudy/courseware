/**
 * @fileoverview Check whether the given variable is truthy or not.
 */

"use strict";

import isExisty from "./isExisty";

/**
 * Check whether the given variable is truthy or not.
 * If the given variable is not null or not undefined or not false, returns true.
 * (It regards 0 as true)
 * @param {*} obj - Target for checking
 * @returns {boolean} Is truthy?
 * @memberof module:type
 */
function isTruthy(obj) {
  return isExisty(obj) && obj !== false;
}

export default isTruthy;
