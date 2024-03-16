export function extractValuesByKey(array, key) {
  if (!Array.isArray(array)) {
    return [];
  }

  return array.reduce((acc, obj) => {
    if (key in obj) acc.push(obj[key]); // 해당 키가 객체 내에 존재하는 경우 값 추출
    return acc;
  }, []);
}
