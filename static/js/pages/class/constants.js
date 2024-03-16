/**
 * 1. CLASS
 * megaclass와 같이, 선생님이 클래스 관리
 * 여러 코스가 있을 수 있음.
 * mClass
 *
 * 2. SINGLE_COURSE
 * 대학교 수업처럼 단 하나의 코스만을 관리
 * 코스는 하나만 존재
 * mSingleCourseClass
 */
export const TYPE_CLASS = {
  CLASS: 1,
  SINGLE_COURSE: 2,
};

export const TYPE_MEMBER = {
  ANNONYMOUS: 0,
  ADMIN: 1,
  OPERATOR: 2,
  PRODUCER: 4,
  TEACHER: 8,
  STUDENT: 16,
  PARENT: 32,
  USER: 64,
  MANAGER: 128,
};
