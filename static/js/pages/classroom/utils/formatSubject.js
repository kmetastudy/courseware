let subjectMapper = {
  kor: "국어",
  math: "수학",
  eng: "영어",
  info: "정보",
  sci: "과학",
};

export function formatSubject(key) {
  return subjectMapper[key];
}
