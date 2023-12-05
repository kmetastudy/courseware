// import { parseChildren } from "./common-util";
import { MenuItemGroup } from "../menu-item-group";
import { SubMenu } from "../SubMenu/sub-menu";
import { MenuDivider } from "../menu-divider";
import { MenuItem } from "../menu-item";
import { isElement } from "../../_util/type-check";

function convertItemsToNodes(list) {
  return (list || [])
    .map((opt, index) => {
      if (opt && typeof opt === "object") {
        const { label, children, key, type, ...restProps } = opt;
        const mergedKey = key ?? `tmp-${index}`;

        // MenuItemGroup & SubMenuItem
        if (children || type === "group") {
          if (type === "group") {
            // Group
            const clMenuItemGroup = new MenuItemGroup({ key: mergedKey, ...restProps, title: label });
            const node = clMenuItemGroup.getElement();

            if (isElement(children)) {
              const childNodes = convertItemsToNodes(children);
              node.append(...childNodes);
            }
            return node;
          }

          // Sub Menu
          const clSubMenu = new SubMenu({ key: mergedKey, ...restProps, title: label });
          const node = clSubMenu.getElement();
          if (isElement(children)) {
            const childNodes = convertItemsToNodes(children);
            node.append(...childNodes);
          }
          return node;
        }

        // MenuItem & Divider
        if (type === "divider") {
          const clDivider = new MenuDivider({ key: mergedKey, ...restProps });
          const node = clDivider.getElement();
          return node;
        }

        const clMenuItem = new MenuItem({ key: mergedKey, ...restProps });
        const node = clMenuItem.getElement();
        if (isElement(label)) {
          node.appendChild(label);
        } else if (typeof label === "string") {
          node.textContent = label;
        }

        return node;
      }

      return null;
    })
    .filter((opt) => opt);
}

export function parseItems(
  children, // React.ReactNode | undefined,
  items, // ItemType[] | undefined,
  // keyPath, //string
) {
  let childNodes = children;

  if (items) {
    childNodes = convertItemsToNodes(items);
  }

  // return parseChildren(childNodes, keyPath);
  return childNodes;
}
