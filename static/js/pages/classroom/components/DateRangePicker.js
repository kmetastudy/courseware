import elem from "../../../core/utils/elem/elem";
import { getUserLocaleLanguage } from "../../../core/utils/locale";

export class DateRangePicker {
  constructor({ parent, ...rest }) {
    this.parentElement = parent ?? this.createInput();
    this.customOptions = rest;

    this.init();
  }

  init() {
    this.setOptions();

    this.drawCalendar();
  }

  setOptions() {
    const updateInputValue = this.updateInputValue;
    const customHideCalendar = this.customOptions.hideCalendar;
    const defaultOptions = {
      input: true,
      type: "multiple",
      settings: {
        range: {
          disablePast: true,
        },
        selection: {
          day: "multiple-ranged",
        },
        selected: {
          dates: [],
        },
        visibility: {
          theme: "dark",
          daysOutside: false,
        },
        lang: getUserLocaleLanguage(),
      },
      actions: {
        changeToInput(e, calendar) {
          updateInputValue(calendar);
        },
        hideCalendar(calendar) {
          if (customHideCalendar) {
            customHideCalendar(calendar);
          }
        },
      },
    };

    this.options = defaultOptions;
  }

  drawCalendar() {
    this.calendar = new VanillaCalendar(this.parentElement, this.options);

    this.calendar.init();
  }

  createInput() {
    const elInput = elem("input", {
      type: "text",
      class: "input input-bordered w-full max-w-xs",
      placeholder: "날짜를 선택하세요",
    });

    return elInput;
  }

  // API
  updateInputValue(calendar) {
    if (!calendar.HTMLInputElement) {
      return;
    }

    if (calendar.selectedDates[1]) {
      calendar.selectedDates.sort((a, b) => +new Date(a) - +new Date(b));
      calendar.HTMLInputElement.value = `${calendar.selectedDates[0]} — ${
        calendar.selectedDates[calendar.selectedDates.length - 1]
      }`;
    } else if (calendar.selectedDates[0]) {
      calendar.HTMLInputElement.value = calendar.selectedDates[0];
    } else {
      calendar.HTMLInputElement.value = "";
    }
  }

  getSelectedDates() {
    return this.calendar.selectedDates;
  }

  updateSelectedDates(selectedDates) {
    this.calendar.settings.selected.dates = selectedDates;
  }

  deactivate() {
    this.calendar.init();
    if (this.calendar.HTMLInputElement) {
      this.calendar.HTMLInputElement.value = "";
    }
  }
}
