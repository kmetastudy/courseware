function hash(string, modulus) {
  let h = 0;
  for (let i = 0; i < string.length; i++) {
    h = (h * 256 + string.charCodeAt(i)) % modulus;
  }
  return h;
}

function rabinKarp(text, pattern) {
  const m = pattern.length;
  const n = text.length;
  const modulus = 101; // 큰 소수를 사용하는 것이 일반적입니다

  const patternHash = hash(pattern, modulus);
  let textHash = hash(text.substring(0, m), modulus);

  for (let i = 0; i <= n - m; i++) {
    if (patternHash === textHash) {
      if (text.substring(i, i + m) === pattern) {
        return i; // 패턴이 일치하는 위치 반환
      }
    }

    if (i < n - m) {
      textHash = (textHash * 256 - text.charCodeAt(i) * Math.pow(256, m) + text.charCodeAt(i + m)) % modulus;
      if (textHash < 0) textHash += modulus;
    }
  }

  return -1; // 패턴을 찾지 못한 경우
}
