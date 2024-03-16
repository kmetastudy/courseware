import elem from "../../../core/utils/elem/elem";
import { apiClass } from "../../../core/api/class";
import { DatePicker } from "../components/DatePicker";

export class LaunchForm {
  constructor({ onSubmit }) {
    this.onSubmit = onSubmit;
    this.title = "클래스 생성하기";

    this.init();
  }

  init() {
    this.create();
    this.initEvents();
  }

  create() {
    this.elThis = elem("section", {
      class: "card rounded-3xl m-auto bg-base-100 py-4 px-8 w-max sm:px-24 sm:w-[540px]",
    });

    this.elForm = elem("form", { class: "card-body text-center" });
    this.elThis.append(this.elForm);

    this.elTitleWrapper = elem("div", { class: "self-center mb-4" });
    this.elTitle = elem("h1", { class: "text-xl card-title" }, this.title);
    this.elTitleWrapper.append(this.elTitle);

    this.elClassTitleWrapper = elem("div", { class: "form-control" });
    this.elClassTitleLabel = elem("label", { class: "label" });
    this.elClassTitleLabelText = elem("span", { class: "label-text" }, "클래스");
    this.elClassTitleInput = elem("input", {
      type: "text",
      class: "input input-bordered rounded-lg",
      placeholder: "클래스 이름을 작성해주세요",
      name: "title",
      required: "true",
    });

    this.elClassTitleWrapper.append(this.elClassTitleLabel);
    this.elClassTitleLabel.append(this.elClassTitleLabelText);
    this.elClassTitleWrapper.append(this.elClassTitleInput);

    this.elInstitutionWrapper = elem("div", { class: "form-control mb-4" });
    this.elInstitutionLabel = elem("label", { class: "label" });
    this.elInstitutionLabelText = elem("span", { class: "label-text" }, "기관");
    this.elInstitutionInput = elem("input", {
      type: "text",
      class: "input input-bordered rounded-lg",
      name: "institution",
      placeholder: "소속된 기관을 작성해주세요",
    });

    this.elInstitutionWrapper.append(this.elInstitutionLabel);
    this.elInstitutionLabel.append(this.elInstitutionLabelText);
    this.elInstitutionWrapper.append(this.elInstitutionInput);

    // 코스 기간
    this.elCourseRangeTitleWrapper = elem("div", { class: "form-control" });
    this.elCourseRangeTitleLabel = elem("div", { class: "label justify-start gap-2" });
    this.elCourseRangeTitle = elem(
      "span",
      { class: "label-text text-xs font-bold text-base-content/50" },
      "클래스의 기간을 정해주세요.",
    );
    this.elCourseRangeTitleWrapper.append(this.elCourseRangeTitleLabel);
    this.elCourseRangeTitleLabel.append(this.elCourseRangeTitle);

    this.elCourseRangeContainer = elem("div", { class: "form-control mb-4  gap-4 flex-row justify-end" });
    this.elStartDatePicker = elem("input", {
      type: "text",
      placeholder: "시작일",
      readonly: "",
      required: "true",
      class: "input input-bordered input-sm w-full max-w-full",
    });

    const today = dayjs().format("YYYY-MM-DD");

    this.clStartDatePicker = new DatePicker({
      parent: this.elStartDatePicker,
      defaultSelectedDate: today,
    });

    this.elEndDatePicker = elem("input", {
      type: "text",
      placeholder: "종료일",
      readonly: "",
      required: "true",
      class: "input input-bordered input-sm w-full max-w-full",
    });
    this.clEndDatePicker = new DatePicker({
      parent: this.elEndDatePicker,
    });
    console.log(this.elEndDatePicker.value);
    this.elCourseRangeContainer.append(this.elStartDatePicker, this.elEndDatePicker);
    // 기관
    this.elChoiceTextWrapper = elem("div", { class: "form-control" });
    this.elChoiceLabel = elem("div", { class: "label justify-start gap-2" });
    this.elChoiceText = elem(
      "span",
      { class: "label-text text-xs font-bold text-base-content/50" },
      "기관의 유형을 선택해주세요",
    );
    this.elChoiceTextWrapper.append(this.elChoiceLabel);
    this.elChoiceLabel.append(this.elChoiceText);

    this.elChoiceContainer = elem("div", { class: "form-control" });

    // 초등학교
    this.elElementaryWrapper = elem("div", { class: "form-control" });
    this.elElementaryLabel = elem("label", { class: "label cursor-pointer" });
    this.elElementaryLabelText = elem("span", { class: "label-text" }, "초등학교");
    this.elElementaryInput = elem("input", {
      type: "radio",
      name: "institution_type",
      value: 1,
      class: "radio radio-sm",
      checked: "checked",
    });

    this.elElementaryWrapper.append(this.elElementaryLabel);
    this.elElementaryLabel.append(this.elElementaryLabelText);
    this.elElementaryLabel.append(this.elElementaryInput);

    // 중학교
    this.elMiddleSchoolWrapper = elem("div", { class: "form-control" });
    this.elMiddleSchoolLabel = elem("label", { class: "label cursor-pointer" });
    this.elMiddleSchoolLabelText = elem("span", { class: "label-text" }, "중학교");
    this.elMiddleSchoolInput = elem("input", {
      type: "radio",
      name: "institution_type",
      value: 2,
      class: "radio radio-sm",
    });

    this.elMiddleSchoolWrapper.append(this.elMiddleSchoolLabel);
    this.elMiddleSchoolLabel.append(this.elMiddleSchoolLabelText);
    this.elMiddleSchoolLabel.append(this.elMiddleSchoolInput);

    // 고등학교
    this.elHighSchoolWrapper = elem("div", { class: "form-control" });
    this.elHighSchoolLabel = elem("label", { class: "label cursor-pointer" });
    this.elHighSchoolLabelText = elem("span", { class: "label-text" }, "고등학교");
    this.elHighSchoolInput = elem("input", {
      type: "radio",
      name: "institution_type",
      value: 3,
      class: "radio radio-sm",
    });

    this.elHighSchoolWrapper.append(this.elHighSchoolLabel);
    this.elHighSchoolLabel.append(this.elHighSchoolLabelText);
    this.elHighSchoolLabel.append(this.elHighSchoolInput);

    // 기타
    this.elExtraWrapper = elem("div", { class: "form-control" });
    this.elExtraLabel = elem("label", { class: "label cursor-pointer" });
    this.elExtraLabelText = elem("span", { class: "label-text" }, "기타");
    this.elExtraInput = elem("input", {
      type: "radio",
      name: "type",
      class: "radio radio-sm",
      name: "institution_type",
      value: 4,
    });

    this.elExtraWrapper.append(this.elExtraLabel);
    this.elExtraLabel.append(this.elExtraLabelText);
    this.elExtraLabel.append(this.elExtraInput);

    // submit
    this.elSubmitWrapper = elem("div", { class: "form-control mt-4" });
    this.elButtonWrapper = elem("div", { class: "flex items-end py-4" });
    this.elSubmitButton = elem("button", { class: "btn btn-primary grow rounded-lg" }, "생성하기");
    this.elSubmitWrapper.append(this.elButtonWrapper);
    this.elButtonWrapper.append(this.elSubmitButton);

    this.elForm.append(
      this.elTitleWrapper,
      this.elClassTitleWrapper,
      this.elInstitutionWrapper,
      this.elCourseRangeTitleWrapper,
      this.elCourseRangeContainer,
      this.elChoiceTextWrapper,
      this.elChoiceContainer,
      this.elSubmitWrapper,
    );

    this.elChoiceContainer.append(
      this.elElementaryWrapper,
      this.elMiddleSchoolWrapper,
      this.elHighSchoolWrapper,
      this.elExtraWrapper,
    );
  }

  initEvents() {
    this.elForm.addEventListener("submit", this.handleSubmit.bind(this));
  }

  handleSubmit(evt) {
    evt.preventDefault();
    const formData = new FormData(this.elForm);
    const startDateString = this.elStartDatePicker.value;
    const endDateString = this.elEndDatePicker.value;

    const isValidDates = this.validateDates(startDateString, endDateString);

    if (!isValidDates) {
      return;
    }

    const startDate = dayjs(new Date(startDateString)).toISOString();
    const endDate = dayjs(new Date(endDateString)).toISOString();

    formData.append("start_date", startDate);
    formData.append("end_date", endDate);

    if (this.onSubmit) {
      this.onSubmit(evt, formData);
    }
  }

  getElement() {
    return this.elThis;
  }

  // Utils
  validateDates(startDateString, endDateString) {
    const start = dayjs(startDateString);
    const end = dayjs(endDateString);

    if (!start.isValid() || !end.isValid()) {
      console.log("invalid date");
      return false;
    }

    if (start.isAfter(end)) {
      console.log("Start date must be same or smaller than end date");
      return false;
    }

    return true;
  }
}
