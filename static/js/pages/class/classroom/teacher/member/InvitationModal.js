import elem from "../../../../core/utils/elem/elem";
import store from "../../common/Store";
import { MtuIcon } from "../../../../core/mtu/icon/mtu-icon";
export class InvitationModal {
  static INVITATION_ID = 0;
  constructor() {
    this.init();
  }

  init() {
    InvitationModal.INVITATION_ID++;
    const classData = store.getState("classData");
    this.classTitle = classData?.title ?? "";
    this.title = `사용자를 ${this.classTitle} 클래스로 초대하기`;
    this.invitationMessage = "링크를 통해 초대해보세요";

    this.create();
  }

  create() {
    this.elThis = elem("dialog", { class: "modal" });
    this.elBox = elem("div", { class: "modal-box" });
    this.elThis.append(this.elBox);

    this.elHeader = elem("header", { class: "flex items-center gap-2 lg:gap-4" });
    this.elTitle = elem("h3", { class: "font-bold text-lg grow" }, this.title);
    this.elCloseButton = elem(
      "button",
      {
        class: "btn btn-sm btn-circle btn-ghost absolute right-2 top-2",
        on: { click: this.handleCloseClick.bind(this) },
      },
      MtuIcon("close"),
    );
    this.elHeader.append(this.elTitle, this.elCloseButton);

    this.elInvitationMessage = elem("p", { class: "py-4" });

    //
  }

  handleCloseClick(evt) {
    this.close();
  }

  close() {
    this.elThis.close();
  }
}
