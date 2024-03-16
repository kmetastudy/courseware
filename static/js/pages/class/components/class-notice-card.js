import MtmClassCard from "./mtm-class-card";
import elem from "../../../core/utils/elem/elem";

export class ClassNoticeCard extends MtmClassCard {
  constructor() {
    super();

    this.init();
  }

  init() {
    this.setup();
    this.create();
  }

  setup() {
    this.headerTitle = "공지사항";
  }

  create() {
    this.elHeader = this.createHeader();
    this.elWrapper.append(this.elHeader);

    this.elHeaderTitle = this.createHeaderTitle(this.headerTitle);
    this.elAnchor = this.createHeaderAnchor({ text: "더보기", href: "#" });
    this.elHeader.append(this.elHeaderTitle, this.elAnchor);

    this.elBody = elem("div", { class: "class-notice-card-body px-4 py-2" });

    this.elLabel = this.createLabel();
  }

  createLabel() {
    //
  }
}
