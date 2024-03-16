import elem from "../../../../core/utils/elem/elem";
import { extract } from "../../../../core/utils/array/extract";
import { apiUser } from "../../../../core/api/user";
import { apiCp } from "../../../../core/api/cp";
import store from "../../common/Store";
import { AbstractContent } from "../AbstractContent";
import { CourseEmpty } from "./CourseEmpty";
import { ContentHeader } from "../ContentHeader";
import { CourseDetailTable } from "./CourseDetailTable";
import { TableFunctionBar } from "./TableFunctionBar";

export class Course extends AbstractContent {
  constructor() {
    super();

    this.userId = store.getState("userId");
    this.classId = store.getState("classId");

    this.title = "코스";

    this.init();
  }

  init() {
    this.create();

    this.request();
  }

  create() {
    this.elThis = elem("div", {
      class: "classroom-content grid grid-cols-12 grid-rows-[min-content] gap-y-12 p-4 lg:gap-x-12 lg:p-10 hidden",
    });
    this.clHeader = new ContentHeader({ parent: this.elThis, title: this.title });

    this.elListSkeleton = elem(
      "div",
      { class: "col-span-12 flex flex-col gap-4 hidden" },
      elem("div", { class: "skeleton h-4 w-full" }),
      elem("div", { class: "skeleton h-4 w-full" }),
      elem("div", { class: "skeleton h-4 w-full" }),
      elem("div", { class: "skeleton h-4 w-full" }),
    );

    this.clEmpty = new CourseEmpty();
    this.elEmpty = this.clEmpty.getElement();

    this.elTableSection = elem("section", { class: "col-span-12 bg-base-200" });
    this.clTableFunctionBar = new TableFunctionBar();
    this.elTableFunctionBar = this.clTableFunctionBar.getElement();
    this.clCourseDetailTable = new CourseDetailTable();
    this.elTable = this.clCourseDetailTable.getElement();
    this.elTableSection.append(this.elTableFunctionBar, this.elTable);

    this.elThis.append(this.elEmpty, this.elListSkeleton, this.elTableSection);
  }

  async request() {
    const timer = setTimeout(() => {
      this.toggleSkeleton(true);
    }, 100);
    //
    try {
      const coursePurchasesResponse = await apiUser.coursePurchases.filter({ id_user: this.userId });
      const coursePurchases = coursePurchasesResponse.data;

      const courseIds = extract(coursePurchases, "id_course");

      const courseResponse = await apiCp.course.filter({ id__in: courseIds.join(",") });
      const courses = courseResponse.data;

      const formData = new FormData();
      formData.append("course_ids", JSON.stringify(courseIds));

      const detailsResponse = await axios.post(`../../cm/get-detail-list/`, formData);
      const details = detailsResponse.data?.data;

      this.toggleSkeleton(false);
      this.clCourseDetailTable.initTable(courses, details);
    } catch (err) {
      console.error(err);
      this.toggleSkeleton(false);
    } finally {
      clearTimeout(timer);
      this.toggleSkeleton(false);
    }
  }

  toggleSkeleton(show) {
    show ? this.elListSkeleton.classList.remove("hidden") : this.elListSkeleton.classList.add("hidden");
  }
}
