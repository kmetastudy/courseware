function buildLastOccurrenceTable(pattern) {
  const last = {};
  for (let i = 0; i < pattern.length; i++) {
    last[pattern[i]] = i;
  }
  return last;
}

function boyerMoore(text, pattern) {
  const last = buildLastOccurrenceTable(pattern);
  const m = pattern.length;
  const n = text.length;
  let i = m - 1;
  let j = m - 1;

  while (i < n) {
    if (pattern[j] === text[i]) {
      if (j === 0) return i; // 패턴이 일치하는 경우
      i--;
      j--;
    } else {
      i += m - Math.min(j, 1 + (last[text[i]] || -1));
      j = m - 1;
    }
  }

  return -1; // 패턴을 찾지 못한 경우
}
