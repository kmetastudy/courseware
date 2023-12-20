import { MtuIcon } from "../icon/mtu-icon";
import { defaultConfig } from "./config";
import { getDefaultConfig } from "../_util/adjust-config";
import { Tabs } from "./tabs";
import { classNames } from "../../utils/class-names";
require("./mtu-tabs.css");
export function MtuTabs(config = {}) {
  const props = getDefaultConfig(defaultConfig, config);
  const {
    type,
    className,
    rootClassName,
    size: customSize,
    onEdit,
    hideAdd,
    centered,
    addIcon,
    popupClassName,
    children,
    items,
    animated,
    style,
    indicatorSize,
    ...otherProps
  } = props;

  console.log(props);

  const { prefixCls = "mtu-tabs", moreIcon = MtuIcon("ellipsis") } = otherProps;

  // const {direction}

  let editable;
  if (type === "editable-card") {
    editable = {
      onEdit: (editType, { key, event }) => {
        onEdit?.(editType === "add" ? event : key, editType);
        // onEdit?.(editType === "add" ? event : key, editType);
      },
      removeIcon: MtuIcon("close"),
      addIcon: MtuIcon("plus"),
      showAdd: hideAdd !== true,
    };
  }

  const rootPrefixCls = "mtu-tab";

  const attributes = {
    direction,
    moreTransitionName: `${rootPrefixCls}-slide-up`,
    ...otherProps,
    items,
    className: classNames(
      {
        [`${prefixCls}-${size}`]: size,
        [`${prefixCls}-card`]: ["card", "editable-card"].includes(type),
        [`${prefixCls}-editable-card`]: type === "editable-card",
        [`${prefixCls}-centered`]: centered,
      },
      tabs?.className,
      className,
      rootClassName,
      hashId,
    ),
    popupClassName: classNames(popupClassName, hashId),
    style,
    editable,
    moreIcon,
    prefixCls,
    animated,
  };
  indicatorSize ? (attributes.indicatorSize = indicatorSize) : null;
  const tabNode = new Tabs();

  // const
}
