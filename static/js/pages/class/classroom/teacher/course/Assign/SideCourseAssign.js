import elem from "../../../../../core/utils/elem/elem";
import { MtuIcon } from "../../../../../core/mtu/icon/mtu-icon";

export class SideCourseAssign {
  constructor() {
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

  updateData({}) {
    return;
  }
  // 한번에 부여-> 모든 체크박스 체크됨, 체크 해제는 안됨?

  activate() {
    this.elThis.classList.remove("hidden");
    this.isActive = true;
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
