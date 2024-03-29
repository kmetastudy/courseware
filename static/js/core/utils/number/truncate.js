/**
 * Truncates a given number to a specified number of decimal places without rounding.
 * This function ensures that the number is cut off at the specified decimal place, effectively
 * discarding any digits that follow. It operates on both floating point numbers and their string
 * representations, converting strings to floats internally.
 *
 * @param {number|string} number The number or string representation of a number to truncate.
 * @param {number} [decimalPlaces=0] The number of decimal places to retain. Additional digits beyond this
 *        precision are discarded. The default is 0
 * @returns {number} The truncated number, with precision limited to the specified number of decimal places.
 *
 * @example
 * // Truncates to two decimal places
 * truncate(3.14159, 2); // returns 3.14
 *
 * // Truncates a string representation of a number to two decimal places
 * truncate("3.14159", 2); // returns 3.14
 *
 * // Truncates the integer part (when decimal places are set to 0)
 * truncate("301415", 0); // returns 301415
 */
export function truncate(number, decimalPlaces = 0) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.floor(parseFloat(number) * factor) / factor;
}
