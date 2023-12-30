import { config } from "./interface";
import { getDefaultConfig } from "../_util/adjust-config";
import { isObject, isBoolean, isFunction } from "../../utils/type/index";
import { classNames } from "../../utils/class-names";
import extendsObject from "../_util/extends-object";
import { createElement } from "../../utils/dom-utils";

export class MtuList {
  constructor(options = {}) {
    const param = getDefaultConfig(config, options);

    Object.assign(this, param);

    this.init();
  }

  init() {
    this.setup();
    this.render();
  }

  setup() {
    this.paginationObj = this.pagination && isObject(this.pagination) ? this.pagination : {};
    this.currentPagination = this.paginationObj.defaultCurrent || 1;

    this.paginationSize = this.paginationObj.defaultPageSize || 10;

    this.defaultPaginationProps = {
      current: 1,
      total: 0,
    };

    this.onPaginationChange = this.triggerPaginationEvent("onChange");
    this.onPaginationShowSizeChange = this.triggerPaginationEvent("onShowSizeChange");

    this.isSomethingAfterLastItem = () => !!(this.loadMore || this.pagination || this.footer);
    this.prefixCls = "mtu-list";

    this.loadingProp = this.loading;
    if (isBoolean(this.loadingProp)) {
      this.loadingProp = {
        spinning: this.loadingProp,
      };
    }

    this.isLoading = this.loadingProp && this.loadingProp.spinning;

    const mergedSize = useSize(this.customizeSize);

    this.sizeCls = "";
    switch (mergedSize) {
      case "large":
        this.sizeCls = "lg";
        break;
      case "small":
        this.sizeCls = "sm";
        break;
      default:
        break;
    }

    this.classString = classNames(
      this.prefixCls,
      {
        [`${this.prefixCls}-vertical`]: this.itemLayout === "vertical",
        [`${this.prefixCls}-${sizeCls}`]: this.sizeCls,
        [`${this.prefixCls}-split`]: this.split,
        [`${this.prefixCls}-bordered`]: this.bordered,
        [`${this.prefixCls}-loading`]: this.isLoading,
        [`${this.prefixCls}-grid`]: !!this.grid,
        [`${this.prefixCls}-something-after-last-item`]: isSomethingAfterLastItem(),
        [`${this.prefixCls}-rtl`]: this.direction === "rtl",
      },
      this.list?.className,
      this.className,
      this.rootClassName,
      this.hashId,
    );

    const paginationProps = extendsObject(
      this.defaultPaginationProps,
      {
        total: this.dataSource.length,
        current: this.paginationCurrent,
        pageSize: this.paginationSize,
      },
      this.pagination || {},
    );

    const largestPage = Math.ceil(paginationProps.total / paginationProps.pageSize);
    if (paginationProps.current > largestPage) {
      paginationProps.current = largestPage;
    }

    // TODO: Add pagination feature
    this.paginationContent = null;

    this.splitDataSource = [...this.dataSource];
    if (this.pagination) {
      if (this.dataSource.length > (paginationProps.current - 1) * paginationProps.pageSize) {
        this.splitDataSource = [...dataSource].splice(
          (paginationProps.current - 1) * paginationProps.pageSize,
          paginationProps.pageSize,
        );
      }
    }

    const needResponsive = Object.keys(this.grid || {}).some((key) =>
      ["xs", "sm", "md", "lg", "xl", "xxl"].includes(key),
    );
    const screens = useBreakpoint(needResponsive);
    const currentBreakpoint = React.useMemo(() => {
      for (let i = 0; i < responsiveArray.length; i += 1) {
        const breakpoint = responsiveArray[i];
        if (screens[breakpoint]) {
          return breakpoint;
        }
      }
      return undefined;
    }, [screens]);

    const colStyle = React.useMemo(() => {
      if (!grid) {
        return undefined;
      }
      const columnCount = currentBreakpoint && grid[currentBreakpoint] ? grid[currentBreakpoint] : grid.column;
      if (columnCount) {
        return {
          width: `${100 / columnCount}%`,
          maxWidth: `${100 / columnCount}%`,
        };
      }
    }, [grid?.column, currentBreakpoint]);

    this.childrenContent = this.setChildrenContent();

    this.paginationPosition = paginationProps.position || "bottom";
    const contextValue = this.setcontextValue();
  }

  render() {
    this.elThis = createElement("div", {
      className: this.classString,
      styles: { ...this.list?.style, ...this.style },
    });

    if (this.header) {
      this.elHeader = createElement("div", {
        className: `${this.prefixCls}-header`,
      });
      this.elHeader.append(this.header);
      this.elThis.append(this.elHeader);
    }
    if (this.childrenContent) {
      this.elThis.append(this.childrenContent);
    }

    if (this.children) {
      this.elThis.append(this.children);
    }

    if (this.footer) {
      this.elFooter = createElement("div", { className: `${this.prefixCls}-footer` });
      this.elFooter.append(this.footer);
      this.elThis.append(this.elFooter);
    }
  }

  getElement() {
    return this.elThis;
  }

  // ============ State ============
  setPaginationCurrent(pagination) {
    this.paginationCurrent = pagination;
  }

  setPaginationSize(paginationSize) {
    this.paginationSize = paginationSize;
  }

  // ============ Handler ============
  triggerPaginationEvent = (eventName) => (page, pageSize) => {
    this.setPaginationCurrent(page);
    this.setPaginationSize(pageSize);
    if (this.pagination && this.pagination[eventName]) {
      this.pagination[eventName](page, pageSize);
    }
  };

  // ============ API ============
  renderInnerItem(item, index) {
    if (!this.renderItem) return null;

    let key;

    if (isFunction(this.rowKey)) {
      key = rowKey(item);
    } else if (this.rowKey) {
      key = item[this.rowKey];
    } else {
      key = item.key;
    }

    if (!key) {
      key = `list-item-${index}`;
    }
    return;
    // return <React.Fragment key={key}>{renderItem(item, index)}</React.Fragment>;
  }

  setcontextValue(grid, itemLayout) {
    if (JSON.stringify(grid) !== JSON.stringify(this.grid) || itemLayout === itemLayout) {
      return { grid, itemLayout };
    }
  }

  setChildrenContent() {
    this.isLoading && createElement("div", { styles: { minHeight: 53 } });
    if (splitDataSource.length > 0) {
      const items = splitDataSource.map((item, index) => this.renderInnerItem(item, index));
      childrenContent = grid ? (
        <Row gutter={grid.gutter}>
          {React.Children.map(items, (child) => (
            <div key={child?.key} style={colStyle}>
              {child}
            </div>
          ))}
        </Row>
      ) : (
        <ul className={`${prefixCls}-items`}>{items}</ul>
      );
    } else if (!children && !isLoading) {
      childrenContent = (
        <div className={`${prefixCls}-empty-text`}>
          {(locale && locale.emptyText) || renderEmpty?.("List") || <DefaultRenderEmpty componentName="List" />}
        </div>
      );
    }
  }
}
