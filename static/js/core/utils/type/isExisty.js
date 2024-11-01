/**
 * @fileoverview Check whether the given variable is existing or not.
 */

"use strict";

import isUndefined from "./isUndefined";
import isNull from "./isNull";

/**
 * Check whether the given variable is existing or not.
 * If the given variable is not null and not undefined, returns true.
 * @param {*} param - Target for checking
 * @returns {boolean} Is existy?
 * @memberof module:type
 * @example
 * // ES6
 * import isExisty from 'tui-code-snippet/type/isExisty');
 *
 * // CommonJS
 * const isExisty = require('tui-code-snippet/type/isExisty');
 *
 * isExisty(''); //true
 * isExisty(0); //true
 * isExisty([]); //true
 * isExisty({}); //true
 * isExisty(null); //false
 * isExisty(undefined); //false
 */
function isExisty(param) {
  return !isUndefined(param) && !isNull(param);
}

export default isExisty;
