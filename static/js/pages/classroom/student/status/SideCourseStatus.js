import elem from "../../../../../core/utils/elem/elem";
import { MtuIcon } from "../../../../../core/mtu/icon/mtu-icon";
import { apiClass } from "../../../../../core/api/class";
import { extracts } from "../../../../../core/utils/array/extracts";
import { pipe } from "../../../../../core/utils/function/";

export class SideCourseStatus {
  constructor() {
    this.courseId = undefined;
    this.headerTitle = "뒤로가기";
    this.isActive = false;

    this.create();
  }

  create() {
    this.elThis = elem("nav", {
      class: "min-h-screen w-72 flex-col gap-2 overflow-y-auto bg-base-100 px-6 py-10 hidden",
    });
    this.elHeader = elem(
      "div",
      { class: "mx-4 flex items-center gap-2 font-black", style: "cursor:pointer;" },
      this.headerTitle,
    );
    const goBackIcon = MtuIcon("leftCircle", { style: { fontSize: "20px" } });
    this.elHeader.addEventListener("click", () => {
      window.history.back();
    });
    this.elHeader.prepend(goBackIcon);

    this.elMenu = elem("ul", { class: "menu" });
    this.elThis.append(this.elHeader, this.elMenu);
  }

  async init(courseId) {
    const assign = await this.urlGetClassContentAssign(courseId);

    const periodData = this.composePeriodData(assign);

    // this.createItems();
  }

  activate({ courseId } = {}) {
    console.log(courseId);
    this.elThis.classList.remove("hidden");
    this.isActive = true;

    if (!courseId || courseId === this.courseId) {
      return;
    }

    this.init(courseId);
  }

  async urlGetClassContentAssign(courseId) {
    try {
      const response = await apiClass.classContentAssign.get(courseId);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }

  composePeriodData(assign) {
    console.log(assign);
    const data = extracts(assign, ["period", "date"]);
    console.log(data);
  }

  deactivate(context = {}) {
    this.elThis.classList.add("hidden");
    this.isActive = false;
  }

  getElement() {
    return this.elThis;
  }
}
//
