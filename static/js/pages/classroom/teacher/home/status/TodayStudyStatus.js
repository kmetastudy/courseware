import { isNumber } from "../../../../../core/utils/type";

import { removeChildNodes } from "../../../../../core/utils/dom/remove-child-nodes";
import { truncate } from "../../../../../core/utils/number/truncate";

import { createStats } from "../../../components/stat/create-stats";
import { MtuProgress } from "../../../../../core/mtu/progress/mtu-progress";
export class TodayStudyStatus {
  constructor({ rootClassName } = {}) {
    this.rootClassName = rootClassName;
    this.total = null;
    this.completed = null;

    this.init();
  }

  init() {
    this.stats = createStats();

    this.create();
  }

  create() {
    const { Root, Stat, Title, Value, Desc } = this.stats;

    this.elThis = Root({ class: this.rootClassName });

    this.elProgressContainer = Stat({ class: "place-items-center" });

    this.elThis.append(this.elProgressContainer);

    // 1. percentage of members complete today study
    this.elProgressTitle = Title({ child: "오늘의 학습 현황" });
    this.elProgressValue = Value();

    this.elProgressContainer.append(this.elProgressTitle, this.elProgressValue);

    this.elCountContainer = Stat({ class: "place-items-center" });

    this.elThis.append(this.elCountContainer);

    // 2. Count members complete today study
    this.elCountTitle = Title({ child: "오늘의 학습 인원" });
    this.elCountValue = Value();
    this.elCountDesc = Desc();

    this.elCountContainer.append(this.elCountTitle, this.elCountValue);
  }

  // ============ API ============
  getElement() {
    return this.elThis;
  }

  render(total, completed) {
    this.setProgress(total, completed);

    this.setCount(total, completed);
  }

  setProgress(total, completed) {
    console.log(total, completed);
    removeChildNodes(this.elProgressValue);

    const progress = this.calculateProgress(total, completed);

    const clProgress = new MtuProgress({ percent: progress, type: "circle" });
    const elProgress = clProgress.getElement();

    this.elProgressValue.append(elProgress);
  }

  setCount(total = 0, completed = 0) {
    this.elCountValue.textContent = `${completed}/${total}명`;
  }

  // ============ Utils ============
  calculateProgress(total, completed) {
    if (isNumber(total) && isNumber(completed)) {
      return truncate((completed / total) * 100, 0);
    } else {
      return 0;
    }
  }
}
