import elem from "../../../core/utils/elem/elem";
import { omit } from "../../../core/utils/objects";

export function createItem({ title, icon, ...attribute }) {
  const li = elem("li", { ...attribute }, elem("a", title));
  if (icon) {
    li.firstChild.prepend(icon);
  }
  return li;
}

export function createGroup({ title, ...attribute }) {
  return elem("li", { ...attribute }, elem("h2", title), elem("ul"));
}

// export function createMenuItem

export function createCollapsibleSubmenu({ title, icon, ...attribute }) {
  const li = elem("li", { ...attribute });
  const details = elem("details");
  const summary = elem("summary", title);

  if (icon) {
    summary.prepend(icon);
  }

  const ul = elem("ul");

  li.append(details);
  details.append(summary, ul);

  return li;
}

// [({}, {}, {})][{ title: "", child: [] }];
// export function createTreeItem(data) {
//   // console.log(data);
//   const ul = elem("ul");
//   data.forEach((item) => {
//     const li = elem("li", omit(item, ["title", "child"]), elem("a", item.title));
//     if (item.child) {
//       const child = createTreeItem(item.child);
//       li.append(child);
//     }
//     ul.append(li);
//   });

//   return ul;
// }

export function createTreeItem(data) {
  const ul = elem("ul");
  data.forEach((item) => {
    const attribute = omit(item, ["title", "child"]);
    if (!item.child) {
      const li = elem("li", attribute, elem("a", item.title));
      ul.append(li);
    } else {
      const li = elem("li", attribute);
      const details = elem("details");
      const summary = elem("summary", omit(item).title);
      const childs = createTreeItem(item.child);
      li.append(details);
      details.append(summary, childs);
      ul.append(li);
    }
  });

  return ul;
}
