import { BaseApi } from "../core/BaseApi";

export const apiUser = {
  user: new BaseApi("/user/api/user/"),
  coursePurchases: new BaseApi("/user/api/course-purchases/"),
};
