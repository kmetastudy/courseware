function buildPartialMatchTable(pattern) {
  let table = new Array(pattern.length).fill(0);
  let prefixIndex = 0;

  for (let suffixIndex = 1; suffixIndex < pattern.length; suffixIndex++) {
    while (prefixIndex > 0 && pattern[prefixIndex] !== pattern[suffixIndex]) {
      prefixIndex = table[prefixIndex - 1];
    }

    if (pattern[prefixIndex] === pattern[suffixIndex]) {
      prefixIndex++;
    }

    table[suffixIndex] = prefixIndex;
  }

  return table;
}

function KMP(text, pattern) {
  if (pattern.length === 0) {
    return 0; // 패턴이 비어 있는 경우
  }

  let table = buildPartialMatchTable(pattern);
  let textIndex = 0;
  let patternIndex = 0;

  while (textIndex < text.length) {
    if (text[textIndex] === pattern[patternIndex]) {
      if (patternIndex === pattern.length - 1) {
        return textIndex - pattern.length + 1; // 패턴 일치 위치 반환
      }
      textIndex++;
      patternIndex++;
    } else if (patternIndex > 0) {
      patternIndex = table[patternIndex - 1];
    } else {
      textIndex++;
    }
  }

  return -1; // 패턴을 찾지 못한 경우
}
