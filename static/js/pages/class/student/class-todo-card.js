import MtmClassCard from "../components/mtm-class-card";

export default class ClassTodoCard extends MtmClassCard {
  constructor() {
    super();

    this.init();
  }

  init() {
    this.setup();

    this.create();

    this.addHeader(this.headerTitle, this.anchorConfig);
  }

  setup() {
    this.headerTitle = "오늘 일정";
    this.anchorConfig = {
      text: "더보기",
    };
  }

  create() {
    this.elHeader = this.createHeader();
    this.elHeaderTitle = this.createHeaderTitle(this.headerTitle);
    this.elHeaderAnchor = this.createHeaderAnchor(this.anchorConfig);

    this.elWrapper.append(this.elHeaderTitle, this.elHeaderAnchor);

    //
  }
}
