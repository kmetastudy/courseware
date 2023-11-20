function buildSuffixArray(s) {
  let suffixes = [];
  for (let i = 0; i < s.length; i++) {
    suffixes[i] = { index: i, suffix: s.substring(i) };
  }

  suffixes.sort((a, b) => a.suffix.localeCompare(b.suffix));

  let suffixArray = suffixes.map((x) => x.index);
  return suffixArray;
}

function searchWithSuffixArray(text, pattern, suffixArr) {
  let l = 0,
    r = text.length - 1;
  while (l <= r) {
    let mid = Math.floor((l + r) / 2);
    let cmp = pattern.localeCompare(text.substring(suffixArr[mid], suffixArr[mid] + pattern.length));

    if (cmp === 0) {
      return suffixArr[mid]; // 패턴이 일치하는 위치 반환
    }

    if (cmp < 0) r = mid - 1;
    else l = mid + 1;
  }

  return -1; // 패턴을 찾지 못한 경우
}
