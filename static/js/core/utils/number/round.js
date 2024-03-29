/**
 * Rounds a given number to a specified number of decimal places with precision.
 * The input can be a number or a string representation of a number, which will be converted to a float within the function.
 *
 * @param {number|string} number The number or string representation of a number to round.
 * @param {number} [decimalPlaces=0] The number of decimal places to round to. The default is 0.
 * @returns {number} The rounded result with precision to the specified number of decimal places.
 *
 * @example
 * // Rounds to two decimal places
 * round(3.1415, 2); // returns 3.14
 *
 * // Rounds a string representation of a number to two decimal places
 * round("3.1415", 2); // returns 3.14
 *
 * // Rounds the integer part (when decimal places are set to 0)
 * round("301415", 0); // returns 301415
 */
export function round(number, decimalPlaces = 0) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(parseFloat(number) * factor) / factor;
}
