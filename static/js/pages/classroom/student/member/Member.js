import elem from "../../../../core/utils/elem/elem";
import { store } from "../Store";
import { apiClass } from "../../../../core/api/class";
import { apiUser } from "../../../../core/api/user";
import { extract } from "../../../../core/utils/array/extract";

import { ContentHeader } from "../../components/ContentHeader";
import { MemberTable } from "./MemberTable";

export class Member {
  constructor() {
    this.title = "멤버";

    this.init();
  }

  init() {
    this.create();
    this.request();
  }

  create() {
    this.elThis = elem("div", {
      class: "classroom-content grid grid-cols-12 grid-rows-[min-content] gap-y-12 p-4 lg:gap-x-12 lg:p-10",
    });
    this.clHeader = new ContentHeader({ parent: this.elThis, title: this.title });

    this.elListSkeleton = elem(
      "section",
      { class: "col-span-12 lg:col-span-8" },
      elem("div", { class: "skeleton mb-4 w-full h-4" }), // toolbar
      elem(
        "div",
        { class: "col-span-12 flex flex-col gap-4 hidden" },
        elem("div", { class: "skeleton h-4 w-full" }),
        elem("div", { class: "skeleton h-4 w-full" }),
        elem("div", { class: "skeleton h-4 w-full" }),
        elem("div", { class: "skeleton h-4 w-full" }),
      ),
    );

    this.clTable = new MemberTable();
    this.elTable = this.clTable.getElement();

    this.elThis.append(this.elListSkeleton, this.elTable);
  }

  activate(context = {}) {
    this.elThis?.classList.remove("hidden");
    this.isActive = true;
  }

  deactivate(context = {}) {
    this.elThis?.classList.add("hidden");
    this.isActive = false;
  }

  async request() {
    const timer = setTimeout(() => {
      this.toggleSkeleton(true);
    }, 100);
    //
    try {
      const classId = store.getState("classId");

      const responseMember = await apiClass.classMember.filter({ id_class: classId });
      const members = responseMember.data;

      const userIds = extract(members, "id_user");

      const responseUsers = await apiUser.user.filter({ id__in: userIds.join(",") });
      const users = responseUsers.data;

      const tableData = this.composeTableData({ members, users });
      this.clTable.initTable({ data: tableData });
      this.toggleSkeleton(false);
    } catch (err) {
      console.error(err);
      this.toggleSkeleton(false);
    } finally {
      clearTimeout(timer);
      this.toggleSkeleton(false);
    }
  }

  composeTableData({ members, users }) {
    return users.map((user) => {
      const { id } = user;
      const member = members.find((data) => data.id_user === id);
      user.type = member?.type;
      user.created_date = member?.created_date;
      return user;
    });
  }

  toggleSkeleton(show) {
    show ? this.elListSkeleton.classList.remove("hidden") : this.elListSkeleton.classList.add("hidden");
  }

  getElement() {
    return this.elThis;
  }
}
