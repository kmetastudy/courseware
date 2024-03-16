import elem from "../../../core/utils/elem/elem";
import { getUserLocaleLanguage } from "../../../core/utils/locale";
export class DatePicker {
  constructor({ parent, defaultSelectedDate, ...rest }) {
    this.parentElement = parent ?? this.createInput();
    this.customOptions = rest;
    this.defaultSelectedDate = defaultSelectedDate;

    this.stack = [];

    this.init();
  }

  init() {
    this.setOptions();
    this.drawCalendar();
  }

  setOptions() {
    const updateInputValue = this.updateInputValue;
    const customChangeToInput = this.customOptions.changeToInput;

    const defaultOptions = {
      input: true,
      actions: {
        changeToInput(e, calendar, self) {
          updateInputValue(calendar, self);
          if (customChangeToInput) {
            customChangeToInput(calendar, self);
          }
        },
        clickDay(e, self) {},
      },
      range: {
        disablePast: true,
      },
      settings: {
        range: {
          disablePast: true,
        },
        visibility: {
          positionToInput: "center",
          daysOutside: false,
          theme: "light",
        },
        lang: getUserLocaleLanguage(),
        selection: {
          day: "single",
          cancelableDay: false,
        },

        selected: {
          dates: [],
        },
      },
    };

    if (this.customOptions.clickDay) {
      defaultOptions.actions.clickDay = this.customOptions.clickDay;
    }

    if (this.customOptions?.settings?.selected) {
      defaultOptions.settings.selected = this.customOptions.settings.selected;
    }

    if (this.defaultSelectedDate) {
      defaultOptions.settings.selected.dates.push(this.defaultSelectedDate);
      this.parentElement.value = this.defaultSelectedDate;
    }

    this.options = defaultOptions;
  }

  drawCalendar() {
    this.calendar = new VanillaCalendar(this.parentElement, this.options);

    this.calendar.init();
  }

  createInput() {
    const elInput = elem("input", {
      type: "text",
      class: "input input-borderedm w-full max-w-xs",
      placeholder: "날짜를 선택하세요",
    });

    return elInput;
  }

  updateInputValue(calendar, self) {
    if (!self.HTMLInputElement) {
      return;
    }

    if (self.selectedDates[0]) {
      self.HTMLInputElement.value = self.selectedDates[0];
      calendar.hide();
    } else {
      self.HTMLInputElement.value = "";
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
