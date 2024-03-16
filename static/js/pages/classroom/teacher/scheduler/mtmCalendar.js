require("./mtmCalendar.css");
export class MtmCalendar {
  constructor(target, config = {}) {
    if (!target) {
      throw new Error(`Invalid target: ${target}`);
    }

    this.target = target;
    this.customConfig = config;

    this.init();
  }

  init() {
    this.setConfig();
    setTimeout(() => {
      this.create();
      this.render();
    });
  }

  setConfig() {
    this.defaultConfig = {
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "prev",
        center: "title",
        right: "next",
      },
      contentHeight: "auto",
      selectable: true,
      eventClick: (info) => {
        console.log(info);
      },
      select: (info) => {
        console.log(info);
      },

      navLinks: true, // can click day/week names to navigate views
      editable: true,

      dayMaxEvents: true, // allow "more" link when too many events
    };

    this.config = Object.assign(this.defaultConfig, this.customConfig);
  }

  create() {
    this.calendar = new FullCalendar.Calendar(this.target, this.config);
  }

  render() {
    this.calendar.render();
  }

  addEvent(event) {
    if (!isNan()(date)) this.calendar.addEvent(event);
  }

  handleDateClick(info) {
    console.log(info);
  }
}
