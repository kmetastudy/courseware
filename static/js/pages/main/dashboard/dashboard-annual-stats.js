import { createElement } from "../../../core/utils/dom-utils";
import { dashboardTitle } from "./common/dashboard-title";
import { DateStepper } from "./common/date-stepper";
import { sampleData } from "../../../core/component/d3/sample-data";
import { classNames } from "../../../core/utils/class-names";

require("../../../../css/pages/main/dashboard/dashboard-annual-stats.css");
export class DashboardAnnualStats {
  static INDEX = 0;
  constructor({ className } = {}) {
    this.className = typeof className === "string" || Array.isArray(className) ? className : null;
    this.init();
  }

  init() {
    this.initVariables();
    this.create();

    DashboardAnnualStats.INDEX++;
    this.paintCalendar();
  }

  initVariables() {
    this.prefixCls = "dashboard-annual-stats";
    this.title = "연간 학습";

    this.calendarCls = `${this.prefixCls}-calendar`;
    this.calendarLegendCls = `${this.prefixCls}-calendar-legend`;
    this.calendarId = `${this.calendarCls}-${DashboardAnnualStats.INDEX}`;
    this.calendarLegendId = `${this.calendarLegendCls}-${DashboardAnnualStats.INDEX}`;
    this.currentYear = new Date().getFullYear();
  }

  create() {
    this.elThis = createElement("div", { className: classNames(this.className, this.prefixCls) });

    this.elHeader = this.createHeader();
    this.elBody = this.createBody();
    // this.elFooter = this.createFooter();

    this.elThis.append(this.elHeader, this.elBody);
    // this.elThis.append(this.elHeader, this.elBody, this.elFooter);
  }

  createHeader() {
    const elHeader = createElement("div", { className: `${this.prefixCls}-header` });
    const elTitle = dashboardTitle({ title: this.title, className: `${this.prefixCls}-title` });

    const clDateStepper = new DateStepper({ format: "year" });
    const elDateStepper = clDateStepper.getElement();

    elHeader.append(elTitle, elDateStepper);

    return elHeader;
  }

  createBody() {
    const elBody = createElement("div", {
      className: `${this.prefixCls}-body`,
      // styles: {
      //   background: "#22272d",
      //   color: "#adbac7",
      //   borderRadius: "3px",
      //   padding: "1rem",
      //   overflow: "hidden",
      // },
    });

    const elCalendar = this.createCalendar();
    const elCalendarLegend = this.createCalendarLegend();

    elBody.append(elCalendar, elCalendarLegend);

    return elBody;
  }

  createCalendar() {
    const elCalendar = createElement("div", {
      className: this.calendarCls,
      attributes: { id: `${this.calendarId}` },
      styles: {
        background: "#22272d",
        color: "#adbac7",
        borderRadius: "3px",
        padding: "1rem",
        overflow: "hidden",
      },
    });

    this.elCalendar = elCalendar;
    return elCalendar;
  }

  createCalendarLegend() {
    const elWrapper = createElement("div", {
      styles: {
        float: "right",
        fontSize: "12px",
        marginTop: "8px",
      },
    });

    const elTextLess = createElement("span", {
      styles: {
        color: "#768390",
        fontSize: "12px",
      },
    });
    elTextLess.textContent = "Less";

    const elCalendarLegend = createElement("div", {
      className: this.calendarLegendCls,
      styles: {
        display: "inline-block",
        margin: "0 4px",
      },
      attributes: { id: `${this.calendarLegendId}` },
    });

    const elTextMore = createElement("span", {
      styles: {
        color: "#768390",
        fontSize: "12px",
      },
    });
    elTextMore.textContent = "More";

    elWrapper.append(elTextLess, elCalendarLegend, elTextMore);
    return elWrapper;
  }

  //////////// API ////////////
  paintCalendar(data = sampleData) {
    const cal = new CalHeatmap();
    cal.paint(
      {
        data: {
          source: data,
          // type: "json",
          x: "date",
          y: (d) => +d["temp_max"],
          groupY: "max",
        },
        date: { start: new Date(`${this.currentYear - 1}-01-01`) },
        range: 12,
        scale: {
          color: {
            type: "threshold",
            range: ["#14432a", "#166b34", "#37a446", "#4dd05a"],
            domain: [10, 20, 30],
          },
        },
        domain: {
          type: "month",
          gutter: 4, // space between, in pixel
          label: { text: "MMM", textAlign: "start", position: "top" },
        },
        subDomain: { type: "ghDay", radius: 2, width: 8, height: 8, gutter: 4 },
        itemSelector: `#${this.calendarId}`,
      },
      [
        [
          Tooltip,
          {
            text: function (date, value, dayjsDate) {
              return (value ? value : "No") + " contributions on " + dayjsDate.format("dddd, MMMM D, YYYY");
            },
          },
        ],
        [
          LegendLite,
          {
            includeBlank: true,
            itemSelector: `#${this.calendarLegendId}`,
            radius: 2,
            width: 11,
            height: 11,
            gutter: 4,
          },
        ],
        [
          CalendarLabel,
          {
            width: 30,
            textAlign: "start",
            text: () => dayjs.weekdaysShort().map((d, i) => (i % 2 == 0 ? "" : d)),
            padding: [25, 0, 0, 0],
          },
        ],
      ],
    );
  }

  getElement() {
    return this.elThis;
  }
}
