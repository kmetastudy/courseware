/**
 *
 * @param {[object]} array
 * @param {array} keys [key1, key2, ...]
 * @returns
 */
export function extractValuesByKeys(array, keys) {
  if (!Array.isArray(array) || !Array.isArray(keys)) {
    return [];
  }

  return array.reduce((acc, obj) => {
    const extracted = keys.reduce((result, key) => {
      if (key in obj) result[key] = obj[key]; // 해당 키가 객체 내에 존재하는 경우 값을 추출하여 결과 객체에 추가
      return result;
    }, {});

    // 추출된 값이 있는 경우에만 누적기에 추가
    if (Object.keys(extracted).length > 0) acc.push(extracted);
    return acc;
  }, []);
}
