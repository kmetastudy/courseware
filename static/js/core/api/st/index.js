import { BaseApi } from "../core/BaseApi";

export const apiStudent = {
  studyResult: new BaseApi("/st/api/study_result/"),
  demoStudyResult: new BaseApi("/st/api/demo_studyresult/"),
};
