import { mtoEvents } from "../../../core/utils/mto-events";
import { mtuMenu } from "../../../core/ui/menu/mtu-menu";
import { ApiCp } from "../../../core/api/api-cp";
/**
 *
 * Refactor mtmStudyContainer
 * @param {*} options
 */
export var StudyCourseContainer = function (options = {}) {
  this.options = options;
  this.elThis = null;

  this.selected_course_index = -1;

  this.api = new ApiCp("cp", "course");
  this._init();
};

StudyCourseContainer.prototype._init = function () {
  this.elThis = document.createElement("div");
  this._initVariables();

  this.clMenu = new mtuMenu();

  const courseId = this.options.courseId;
  this.getCourses(courseId);
};

StudyCourseContainer.prototype._initVariables = function () {
  this.courseId = this.options.courseId ?? null;
  this.isDemo = this.options.demo ?? null; // annonymous?
  this.userType = this.options.userId ?? null;
};

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// Handler  ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
// Click Branch
StudyCourseContainer.prototype.handleContentClick = function (item) {
  const contentData = item.data;
  const param = {
    course_id: this.courseId,
    content_id: contentData.id,
    content_type: contentData.type,
    title: contentData.title,
  };
  mtoEvents.emit("OnChangeCourseContent", param);
  // branchData.id;
};

////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// URL  //////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
StudyCourseContainer.prototype.urlGetCourseTree = async function (courseId) {
  try {
    console.log(courseId);
    const formData = new FormData();
    formData.append("id", courseId);
    return await axios.post("../cp/get-full-course/", formData).then((res) => {
      console.log(res);
      if (res.data.result) {
        return res.data.result;
      }
    });
  } catch (err) {
    console.log(err);
  }
};

StudyCourseContainer.prototype.urlGetCourse = async function (id, field_type) {
  try {
    const validFieldType = ["lists", "contents", "keys"];
    if (validFieldType.indexOf(field_type) === -1) {
      throw new Error(`Invalid field_type: ${field_type}`);
    }

    const param = {
      id: id,
      field_type: "lists",
    };
    const result = this.api.filter(param);
    return result;
  } catch (err) {
    console.log(err);
  }
};

////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// API  //////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
StudyCourseContainer.prototype.getCourses = async function (courseId) {
  try {
    const data = await this.urlGetCourseTree(courseId);
    console.log(data);

    this.courseId = data.id;
    this.courseData = data;

    // this.courseDropdown.setData(this.courseData);
    // 아니면, this.mtuMenu.setData(this.courseData)
    const menuItems = this.composeCourseItems(data);
    this.clMenu.render(menuItems);
    this.elThis.appendChild(this.clMenu.getRootElement());

    // course list data (mCourse)
    // this.courseData = await this.urlGetCourse(courseId, "lists");
    // console.log(this.courseData);
  } catch (error) {
    console.log(error);
  }
};

StudyCourseContainer.prototype.composeCourseItems = function (data) {
  const items = [];
  const chapters = data.children;
  const depth = 0;
  chapters.forEach((chapter) => {
    this.composeItem(chapter, items, "default", depth);
  });
  return items;
};

StudyCourseContainer.prototype.composeItem = function (data, parent, type, depth) {
  const item = {
    title: data.title,
    type: type ?? "default",
    data: data,
  };

  // branch
  if (depth === 1) {
    item.onClick = this.handleContentClick.bind(this);
  }

  if (data.children) {
    const children = [];
    const size = data.children.length;
    const newDepth = depth + 1;
    for (var i = 0; i < size; i++) {
      this.composeItem(data.children[i], children, type, newDepth);
    }
    item.children = children;
  }

  parent.push(item);
};
