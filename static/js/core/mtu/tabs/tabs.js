import { classNames } from "../../utils/class-names";
import { createElement } from "../../utils/dom-utils";
import isObject from "../../utils/type/isObject";

export class Tabs {
  constructor(props = {}) {
    //
    this.init();
  }

  init() {
    this.setup();
    this.create();
  }

  setup() {
    this.tabs = this.setTabs();
    const rtl = this.direction === "rtl";
    this.mergedAnimated = this.animated;
    this.mobile = false;
    this.mergedActiveKey = this.setMergedActiveKey();
    this.activeIndex = this.setActiveIndex();

    this.mergedId = this.setMergedId();

    this.sharedProps = {
      id: this.mergedId,
      activeKey: this.mergedActiveKey,
      animated: this.mergedAnimated,
      tabPosition: this.tabPosition,
      rtl,
      mobile,
    };

    this.tabNavBarProps = {
      ...this.sharedProps,
      editable: this.editable,
      locale: this.locale,
      moreIcon: this.moreIcon,
      moreTransitionName: this.moreTransitionName,
      tabBarGutter,
      onTabClick: onInternalTabClick,
      onTabScroll,
      extra: tabBarExtraContent,
      style: tabBarStyle,
      panes: null,
      getPopupContainer,
      popupClassName,
      indicatorSize,
      indicatorAlign,
    };
  }

  handleInternalTabClick(key, evt) {
    this?.onTabClick(key, evt);

    const isActivatedChanged = key !== this.mergedActiveKey;
    this.setMergedActiveKey(key);
    if (isActivatedChanged) {
      this?.onChange(key);
    }
  }

  // ============ State ============
  setMergedActiveKey() {
    return this.tabs[0]?.key ?? { value: this.activeKey, defaultValue: this.defaultActiveKey };
  }

  setTabs() {
    return (this.items || []).filter((item) => item && isObject(item) && "key" in item);
  }

  setActiveIndex() {
    this.tabs.findIndex((tab) => tab.key === this.mergedActiveKey);
  }

  // ============ Render ============
  create() {
    this.elThis = createElement("div", {
      className: classNames(
        prefixCls,
        `${prefixCls}-${tabPosition}`,
        {
          [`${prefixCls}-mobile`]: mobile,
          [`${prefixCls}-editable`]: editable,
          [`${prefixCls}-rtl`]: rtl,
        },
        className,
      ),
      attributes: {
        id: this.id,
        //
      },
    });

    this.tabNavListWrapper;
    this.tabPanelList;
  }

  getElement() {
    return this.elThis;
  }
}
