export function getAdjacentKey(map, currentKey, direction) {
  let keys = Array.from(map.keys()); // Map의 모든 키를 배열로 변환
  let currentIndex = keys.indexOf(currentKey);

  if (currentIndex === -1) {
    return undefined; // 현재 키가 맵에 없는 경우
  }

  if (direction === "prev") {
    // 이전 키를 반환
    return currentIndex > 0 ? keys[currentIndex - 1] : undefined;
  } else if (direction === "next") {
    // 다음 키를 반환
    return currentIndex < keys.length - 1 ? keys[currentIndex + 1] : undefined;
  } else {
    return undefined; // 방향이 잘못 지정된 경우
  }
}
