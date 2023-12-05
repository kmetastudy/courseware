import { createElement } from "../../../../core/utils/dom-utils";
import { MtuButton } from "../../../../core/mtu/button/mtu-button";

require("./date-stepper.css");

export class DateStepper {
  constructor({ format = "year", date }) {
    this.format = ["year", "month", "day"].includes(format) ? format : "year";
    this.date = this.isValidDate(date) ? date : this.getCurrentDate(this.format);
    this.init();
  }

  init() {
    this.initVariables();
    this.create();
  }

  initVariables() {
    this.prefixCls = "date-stepper";
    // TODO
    // This is test value
    this.title = `${this.date}년`;
  }

  create() {
    this.elThis = createElement("div", { className: this.prefixCls });

    this.prevButton = new MtuButton({ type: "text", icon: "left", onClick: this.handleClickPrev.bind(this) });
    this.nextButton = new MtuButton({ type: "text", icon: "right", onClick: this.handleClickNext.bind(this) });

    this.elPrevButton = this.prevButton.getElement();
    this.elDateTitle = this.createDateTitle(this.title);
    this.elNextButton = this.nextButton.getElement();

    this.elThis.append(this.elPrevButton, this.elDateTitle, this.elNextButton);
  }

  createDateTitle(title) {
    const elDateTitle = createElement("p", { className: `${this.prefixCls}-title` });
    elDateTitle.textContent = title;
    return elDateTitle;
  }

  //////////// Handler ////////////
  handleClickPrev(evt) {}

  handleClickNext(evt) {
    //
  }

  //////////// API ////////////
  getCurrentDate(format) {
    const now = new Date();
    const currentDate = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    };
    if (format) {
      return currentDate[format];
    }

    return [year, month, day];
  }

  getFullDate(format, date) {
    const [currentYear, currentMonth, currentDate] = this.getFullDate();
    const fullDate = {
      year: format === "year" ? date : currentYear,
      month: format === "month" ? date : currentMonth,
      day: format === "day" ? date : currentDate,
    };
    return fullDate;
  }

  changeDate(format, date) {}

  getElement() {
    return this.elThis;
  }
  //////////// Utils ////////////

  isValidDate() {}
}
