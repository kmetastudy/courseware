export function sum(arr) {
  if (!Array.isArray(arr)) {
    return;
  }
  // return arr.reduce((accum, value) => accum + value, 0);

  // Only number
  return arr.reduce((accum, value) => {
    return typeof value === "number" ? accum + value : accum;
  }, 0);
}
