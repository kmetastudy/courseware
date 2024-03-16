import elem from "../../core/utils/elem/elem";
import { extract } from "../../core/utils/array";
import store from "./common/Store";
import { classroomRouter } from "./classroom/ClassroomRouter";
import { mtoEvents } from "../../core/utils/mto-events";
import { TYPE_CLASS } from "./constants";

import { apiClass } from "../../core/api/class";

import { SideManager } from "./classroom/SideManager";
import { ContentManager } from "./classroom/ContentManager";
import { createCourseAssignManager } from "./classroom/course/Assign/ClassCourseAssignManager";

require("../../../css/pages/class/AppClassroom.css");
export class AppClassroomTeacher {
  static LOCAL_STORAGE_KEY = "LAST_VISITED_CLASS";
  /**
   *
   * @param {object} options
   * @property {number} userType
   * @property {string} userId
   * @property {boolean} userLogin
   */
  constructor({ userType, userId, classId, parent } = {}) {
    this.userType = userType;
    this.userId = userId;
    this.parentElement = parent;

    store.setState("userId", userId);
    store.setState("userType", userType);
    // FIXME:
    // 일단 임의로 classType 설정
    // class / singleCourse
    this.classType = TYPE_CLASS.SINGLE_COURSE;
    store.setState("classType", this.classType);
    console.log(this.classType);

    this.classId = null;
    this.classData = null;

    if (classId) {
      store.setState("classId", classId);
      this.classId = classId;
    }

    this.init();
  }

  async init() {
    this.create();

    await this.prepareData();

    this.storeData();

    const CLASS_TYPE = store.getState("classType");
    const MEMBER_TYPE = store.getState("memberType");

    const router = classroomRouter(CLASS_TYPE, MEMBER_TYPE);
    store.setState("router", router);

    const courseAssignManager = createCourseAssignManager();
    courseAssignManager.start(CLASS_TYPE, MEMBER_TYPE);
    store.setState("courseAssignManager", courseAssignManager);

    this.createComponent();

    this.activateInitial();
  }

  async prepareData() {
    try {
      const classMemberResponse = await apiClass.classMember.filter({ id_user: this.userId });
      this.joinedClasses = classMemberResponse?.data;
      this.classId = this.classId ?? this.getLastVisitedClassId(this.joinedClasses);

      let classResponse;
      switch (this.classType) {
        case TYPE_CLASS.CLASS:
          classResponse = await apiClass.class.get(this.classId);
          break;
        case TYPE_CLASS.SINGLE_COURSE:
          classResponse = await apiClass.singleCourseClass.get(this.classId);
          store.setState("courseId", classResponse.data.id_course);
          break;
        default:
          break;
      }
      this.classData = classResponse?.data;
      this.memberType = this.joinedClasses.find((classMember) => (classMember.id_class = this.classId))?.type;
    } catch (err) {
      console.log(err);
    }
  }

  storeData() {
    store.setState("userId", this.userId);
    store.setState("userType", this.userType);
    store.setState("classId", this.classId);
    store.setState("classData", this.classData);
    store.setState("joinedClasses", this.joinedClasses);
    store.setState("memberType", this.memberType);
  }

  create() {
    this.elThis = elem("div", { class: "app-class drawer min-h-screen bg-base-200 lg:drawer-open" });
    this.elDrawerToggle = elem("input", { id: "drawer-classroom", type: "checkbox", class: "drawer-toggle" });

    this.elThis.append(this.elDrawerToggle);
  }

  createComponent() {
    const { userId, classId } = this;
    this.clContentManager = new ContentManager({ userId, classId });
    this.elContentManager = this.clContentManager.getElement();

    this.clSideManager = new SideManager();
    this.elSideManager = this.clSideManager.getElement();

    this.elThis.append(this.elContentManager, this.elSideManager);
  }

  getLastVisitedClassId(joinedClasses) {
    const classIds = extract(joinedClasses, "id_class");

    const lastVisitedClassId = localStorage.getItem(AppClassroom.LOCAL_STORAGE_KEY);

    return classIds.includes(lastVisitedClassId) ? lastVisitedClassId : classIds[0];
  }

  activateInitial() {
    mtoEvents.emit("activateSide", { key: "main" });
    // mtoEvents.emit("activateContent", { key: "course" });
  }

  getElement() {
    return this.elThis;
  }

  initRouters() {
    /**
     * router은 여기서 관리하자.
     */
  }
}
