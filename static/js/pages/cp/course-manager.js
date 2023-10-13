import { mtuDropdown } from "../../core/ui/mtu-dropdown";
import { ApiCp } from "../../core/api/api-cp";
import { mtoEvents } from "../../core/utils/mto-events";

export const CourseManager = function (options = {}) {
  this.options = options;
  this._init();
};

CourseManager.prototype._init = function () {
  this._create();

  this.courseBookApi = new ApiCp("cp", "course_book");
  this.courseBookBranchApi = new ApiCp("cp", "course_book_branch");

  this.activate();
};

CourseManager.prototype._create = function () {
  this.elThis = document.createElement("div");
  this.elThis.classList.add("course-manager");
};

// ===============================================================
// ============================= Handler =========================
// ===============================================================
CourseManager.prototype.handleItemClick = function (data) {
  console.log("CourseManager > hanleItemClick > name: ", data);

  if (data && data.id) {
    this.initializeBranch(data.id);
  }
};

// ===============================================================
// ============================== URL ============================
// ===============================================================
CourseManager.prototype.urlCreateCourseBook = async function (dataToCreate) {
  try {
    const createdData = await this.courseBookApi.create(dataToCreate);
    return createdData;
  } catch (err) {
    console.error(err);
  }
};
CourseManager.prototype.urlGetCourseBook = async function (id) {
  try {
    const data = await this.courseBookApi.get(id);
    return data;
  } catch (err) {
    console.error(err);
  }
};
// Course Book Branch
CourseManager.prototype.urlFilterCourseBookBranch = async function (conditions) {
  try {
    const result = await this.courseBookBranchApi.filter(conditions);
    return result;
  } catch (err) {
    console.error(err);
  }
};

CourseManager.prototype.urlGetFullCourse = async function (bookId) {
  try {
    const formData = new FormData();
    formData.append("id", bookId);
    return await axios.post("../cp/get-full-course/", formData).then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    });
  } catch (err) {
    console.log(err);
  }
};
// ===============================================================
// ============================== API ============================
// ===============================================================
CourseManager.prototype.activate = async function () {
  try {
    const courseBookData = await this.urlGetCourseBook();
    this.initDropdown(courseBookData);
  } catch (err) {
    console.error(err);
  }
};

CourseManager.prototype.initDropdown = function (data) {
  this.clDropdown = new mtuDropdown(data, {
    placeholder: "코스",
    onItemClick: this.handleItemClick.bind(this),
  });

  this.elThis.appendChild(this.clDropdown.getElement());
};

// CourseManager.prototype.initializeBranch = async function (id) {
//   try {
//     const filter = {
//       parent_id: id,
//     };
//     const branchFullData = await this.urlFilterCourseBookBranch(filter);
//     console.log(branchFullData);
//     mtoEvents.emit("onCourseBookSelect", branchFullData);
//   } catch (err) {
//     console.error(err);
//   }
// };

CourseManager.prototype.initializeBranch = async function (bookId) {
  try {
    const branchFullData = await this.urlGetFullCourse(bookId);
    console.log(branchFullData);
    mtoEvents.emit("onCourseBookSelect", branchFullData);
  } catch (err) {
    console.error(err);
  }
};

CourseManager.prototype.getElement = function () {
  return this.elThis;
};
