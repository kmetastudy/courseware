import { StudyCourseContainer } from "../../st/study/study-course-container-past";
import { CourseCardManager } from "./detail-course-card";
import { DetailChapter } from "./detail-chapter";
import { MtuIcon } from "../../../core/mtu/icon/mtu-icon";

import { StudyPreview } from "../../st/study/study-preview";

export function DetailManager(context, data) {
  this.context = context;
  this.options = {
    school: [
      { text: "초등", type: "E" },
      { text: "중등", type: "M" },
      { text: "고등", type: "H" },
    ],
    grade: [
      { text: "공통", type: 0 },
      { text: "1학년", type: 1 },
      { text: "2학년", type: 2 },
      { text: "3학년", type: 3 },
    ],
    semester: [
      { text: "공통", type: 0 },
      { text: "1학기", type: 1 },
      { text: "2학기", type: 2 },
    ],
    subject: [
      { text: "국어", type: "kor" },
      { text: "영어", type: "eng" },
      { text: "수학", type: "math" },
      { text: "사회", type: "soc" },
      { text: "역사", type: "hist" },
      { text: "한국사", type: "korhist" },
      { text: "과학", type: "sci" },
      { text: "정보", type: "info" },
      { text: "도덕", type: "mor" },
    ],
    difficulty: [
      { text: "심화", type: 2 },
      { text: "실력향상", type: 1 },
      { text: "개념과기초", type: 0 },
    ],
  };
  this.data = data;
  this.elThis = null;
  this.init();
}

DetailManager.prototype.init = function () {
  var $elHeader = $(`<div class="w-[1200px] p-6 xl:p-10 text-white">
                        <p class="text-[24px] text-white">${this.data.courseTitle}</p>
                        ${this.data.courseSummary}
                    </div>`);
  $(".course_header").append($elHeader);
  console.log(this.data.publisher == "null");

  var pub = this.data.publisher == "null" ? "없음" : this.data.publisher;

  var $elCategory = $(`<div class="px-4 py-3 w-full flex items-center border bg-gray-100">
                            <p class="w-[150px] text-[16px] flex items-center">${
                              MtuIcon("courseTitle").innerHTML
                            }<span class="px-2">코스 제목</span></p>
                            <p class="text-[16px]">${this.data.courseTitle}</p>
                        </div>
                        <div class="px-4 py-3 w-full flex items-center border bg-gray-100">
                            <p class="w-[150px] text-[16px] flex items-center">${
                              MtuIcon("year").innerHTML
                            }<span class="px-2">년도</span></p>
                            <p class="text-[16px]">${this.data.year}</p>
                        </div>
                        <div class="px-4 py-3 w-full flex items-center border bg-gray-100">
                            <p class="w-[150px] text-[16px] flex items-center">${
                              MtuIcon("grade").innerHTML
                            }<span class="px-2">학년</span></p>
                            <p class="text-[16px]">${
                              this.options.school.find((obj) => obj.type == this.data.school).text
                            } ${this.options.grade.find((obj) => obj.type == this.data.grade).text}</p>
                        </div>
                        <div class="px-4 py-3 w-full flex items-center border bg-gray-100">
                            <p class="w-[150px] text-[16px] flex items-center">${
                              MtuIcon("semester").innerHTML
                            }<span class="px-2">학기</span></p>
                            <p class="text-[16px]">${
                              this.options.semester.find((obj) => obj.type == this.data.semester).text
                            }</p>
                        </div>
                        <div class="px-4 py-3 w-full flex items-center border bg-gray-100">
                            <p class="w-[150px] text-[16px] flex items-center">${
                              MtuIcon("subject").innerHTML
                            }<span class="px-2">과목</span></p>
                            <p class="text-[16px]">${
                              this.options.subject.find((obj) => obj.type == this.data.subject).text
                            }</p>
                        </div>
                        <div class="px-4 py-3 w-full flex items-center border bg-gray-100">
                            <p class="w-[150px] text-[16px] flex items-center">${
                              MtuIcon("publisher").innerHTML
                            }<span class="px-2">출판사</span></p>
                            <p class="text-[16px]">${pub}</p>
                        </div>
                        <div class="px-4 py-3 w-full flex items-center border bg-gray-100">
                            <p class="w-[150px] text-[16px] flex items-center">${
                              MtuIcon("difficulty").innerHTML
                            }<span class="px-2">난이도</span></p>
                            <p class="text-[16px]">${
                              this.options.difficulty.find((obj) => obj.type == this.data.difficulty).text
                            }</p>
                        </div>
                        <div class="px-4 py-3 w-full flex items-center border bg-gray-100">
                            <p class="w-[150px] text-[16px] flex items-center">${
                              MtuIcon("producer").innerHTML
                            }<span class="px-2">제작자</span></p>
                            <p class="text-[16px]">${this.data.producer}</p>
                        </div>`);
  $(".desc_category").append($elCategory);

  var desc = this.data.desc == "null" ? "" : this.data.desc;
  $(".desc_content").append(`${desc}`);

  /**
   * 미리보기
   */
  console.log(this.data);
  const { thumnail: thumbnail } = this.data;
  if (thumbnail) {
    // <img class="p-2 w-1/2 h-fit md:w-full" src="../../../../static/img/${this.data.thumnail}.png">
    const previewThumbnail = document.createElement("img");
    previewThumbnail.className = "p-2 max-w-full h-fit md:w-full";
    previewThumbnail.setAttribute("src", `../../../../static/img/${thumbnail}.png`);
    $(".desc_preview_thumbnail").append(previewThumbnail);
  }
  const previewOptions = {
    ...this.context,
    courseId: this.data.courseId,
    courseTitle: this.data.courseTitle,
  };
  this.clStudyPreview = new StudyPreview(previewOptions);
  this.elStudyPreview = this.clStudyPreview.elThis;
  $(".desc_preview_content").append(this.elStudyPreview);

  console.log(this.context);
  const parsedOptions = {
    demo: this.context.demo,
    userType: this.context.userType,
    courseId: this.data.courseId,
    studentId: this.context.userId,
  };
  // var clChapter = new StudyCourseContainer(parsedOptions);
  var clChapter = new DetailChapter(this.data.courseId);

  var clCard = new CourseCardManager(this.options, this.data);
  $(".container-right").append(clCard.elThis);
};
