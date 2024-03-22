import elem from "../../../../core/utils/elem/elem";
import { getUserLocaleLanguage } from "../../../../core/utils/locale";
export class SchedulerCalendar {
  constructor(parent, {} = {}) {
    this.parent = parent;
    this.init();
  }

  init() {
    this.setOptions();

    this.initCalendar();
  }

  setOptions() {
    this.options = {
      actions: {
        clickDay(e, self) {},
      },
      settings: {
        visibility: {
          theme: "light",
        },
        lang: getUserLocaleLanguage(),
        selection: {
          day: "single",
        },
      },
    };
  }

  initCalendar() {
    this.calendar = new VanillaCalendar(this.parent, this.options);

    this.calendar.init();
  }

  updatePopups(popups) {
    this.options.popups = popups;
  }
}
