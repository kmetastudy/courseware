export function transformCourseDetail(detail) {
  const rule = {
    school: {
      E: "초등",
      M: "중등",
      H: "고등",
    },
    grade: {
      0: "공통",
      1: "1학년",
      2: "2학년",
      3: "3학년",
    },
    subject: {
      kor: "국어",
      eng: "영어",
      math: "수학",
      sci: "과학",
      info: "정보",
    },
    difficulty: {
      0: "개념과기초",
      1: "실력향상",
      2: "심화",
    },
  };

  const transformedData = Object.keys(detail).reduce((acc, key) => {
    if (rule[key] && rule[key][detail[key]]) {
      acc[key] = rule[key][detail[key]];
    } else {
      acc[key] = detail[key];
    }
    return acc;
  }, {});

  return transformedData;
}
