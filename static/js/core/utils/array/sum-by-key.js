/**
 * Calculates the sum of a specific property in an array of objects.
 *
 * @param {object[]} array - The array of objects.
 * @param {string} key - The property key to calculate the sum for.
 * @returns {number} - The sum of the specified property values.
 */
export function sumByKey(array, key) {
  if (!Array.isArray(array) || typeof key !== "string") {
    throw new Error("Invalid input: array and key must be defined and of proper types.");
  }

  let total = 0;
  const { length } = array;

  for (let i = 0; i < length; i++) {
    const target = array[i][key];
    if (target !== undefined && typeof target === "number") {
      total += target;
    }
  }

  return total;
}
