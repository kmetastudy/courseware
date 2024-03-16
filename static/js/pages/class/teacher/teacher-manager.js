import elem from "../../../core/utils/elem/elem";
import { apiClass } from "../../../core/api/class";
import { isHTMLNode } from "../../../core/utils/type";

import { ClassNoticeCard } from "../components/class-notice-card";
import { MtmClassHeader } from "../common/mtm-class-header";
require("../../../../css/pages/class/teacher/teacher-manager.css");
export class TeacherManager {
  static LOCAL_STORAGE_KEY = "LAST_VISITED_CLASS";
  constructor(parent, { userType, userId } = {}) {
    if (!isHTMLNode(parent)) {
      throw new Error("parent required");
    }
    this.parent = parent;
    this.userType = userType;
    this.userId = userId;

    this.classList = null; // data list of mClass [{}]
    this.lastVisitedClassId = null;
    this.currentClassId = null;

    this.init();
  }

  async init() {
    this.create();
    this.appendParent();

    this.lastVisitedClassId = localStorage.getItem(TeacherManager.LOCAL_STORAGE_KEY);
    console.log("last:", this.lastVisitedClassId);

    this.classList = await this.getClasses();

    this.currentClassId = this.setCurrentClassId();
    this.currentClassData = this.classList.find((data) => data.id === this.currentClassId);

    this.createComponents();
  }

  create() {
    this.elThis = elem("div", { class: "teacher-manager" });

    this.elLeft = elem("div", { class: "class-manager-left" });
    this.elRight = elem("div", { class: "class-manager-right" });

    this.elThis.append(this.elLeft, this.elRight);
  }

  createComponents() {
    this.clHeader = new MtmClassHeader({ parent: this.elLeft, data: this.classList, initialId: this.currentClassId });
    this.clNoticeCard = null; // 공지사항중 가장 최신 몇개 가져옴

    this.clInfoCard = null;
    this.clClassCard = null;
  }

  // ============ URL ============
  async getClasses() {
    const emptyClassData = [];
    try {
      const classMemberResponse = await apiClass.classMember.filter({ id_user: this.userId });
      const participatingClasses = classMemberResponse.data;
      if (!participatingClasses) {
        return emptyClassData;
      }

      const classIds = participatingClasses.filter((data) => data?.id_class).map(({ id_class }) => id_class);

      const classResponse = await apiClass.class.filter({ id__in: classIds });
      const classList = classResponse.data;

      return classList;
    } catch (err) {
      return emptyClassData;
    }
  }

  // ============ API ============
  setCurrentClassId() {
    const defaultCurrentClassId = this.classList[0].id;

    if (!this.lastVisitedClassId) {
      return defaultCurrentClassId;
    }

    const classIds = data.filter((value) => value?.id).map(({ id }) => id);

    return classIds.include(this.lastVisitedClassId) ? this.lastVisitedClassId : defaultCurrentClassId;
  }

  // ============ URL ============
  getElement() {
    return this.elThis;
  }

  appendParent() {
    if (this.parent && this.elThis) {
      this.parent.append(this.elThis);
    }
  }
}
