import { parseItems } from "./utils/element-util";

export function menu({
  prefixCls = "mtu-menu",
  rootClassName,
  style,
  className,
  tabIndex = 0,
  items,
  direction,

  id,

  // Mode
  mode = "vertical",
  inlineCollapsed,

  // Disabled
  disabled,
  disabledOverflow,

  // Open
  subMenuOpenDelay = 0.1,
  subMenuCloseDelay = 0.1,
  forceSubMenuRender,
  defaultOpenKeys,
  openKeys,

  // Active
  activeKey,
  defaultActiveFirst,

  // Selection
  selectable = true,
  multiple = false,
  defaultSelectedKeys,
  selectedKeys,
  onSelect,
  onDeselect,

  // Level
  inlineIndent = 24,

  // Motion
  motion,
  defaultMotions,

  // Popup
  triggerSubMenuAction = "hover",
  builtinPlacements,

  // Icon
  itemIcon,
  expandIcon,
  overflowedIndicator = "...",
  overflowedIndicatorPopupClassName,

  // Function
  getPopupContainer,

  // Events
  onClick,
  onOpenChange,
  onKeyDown,

  // Deprecated
  openAnimation,
  openTransitionName,

  // Internal
  _internalRenderMenuItem,
  _internalRenderSubMenuItem,

  ...restProps
}) {
  const childList=parseItems(items)

  // const [mounted, setMounted] = React.useState(false);
  const mounted = false;

  // const containerRef = React.useRef<HTMLUListElement>();
  const containerRef = null;

  const uuid = useUUID(id);

  const isRtl = direction === 'rtl';

  // ========================= Open =========================
  const [mergedOpenKeys, setMergedOpenKeys] = useMergedState(defaultOpenKeys, {
    value: openKeys,
    postState: keys => keys || [],
  });

  // React 18 will merge mouse event which means we open key will not sync
  // ref: https://github.com/ant-design/ant-design/issues/38818
  const triggerOpenKeys = (keys, forceFlush = false) => {
    function doUpdate() {
      setMergedOpenKeys(keys);
      onOpenChange?.(keys);
    }

    if (forceFlush) {
      flushSync(doUpdate);
    } else {
      doUpdate();
    }
  };

  // >>>>> Cache & Reset open keys when inlineCollapsed changed
  const [inlineCacheOpenKeys, setInlineCacheOpenKeys] = React.useState(
    mergedOpenKeys,
  );

  const mountRef = React.useRef(false);

  // ========================= Mode =========================
  const [mergedMode, mergedInlineCollapsed] = React.useMemo<
    [MenuMode, boolean]
  >(() => {
    if ((mode === 'inline' || mode === 'vertical') && inlineCollapsed) {
      return ['vertical', inlineCollapsed];
    }
    return [mode, false];
  }, [mode, inlineCollapsed]);

  const isInlineMode = mergedMode === 'inline';

  const [internalMode, setInternalMode] = React.useState(mergedMode);
  const [internalInlineCollapsed, setInternalInlineCollapsed] = React.useState(
    mergedInlineCollapsed,
  );

  React.useEffect(() => {
    setInternalMode(mergedMode);
    setInternalInlineCollapsed(mergedInlineCollapsed);

    if (!mountRef.current) {
      return;
    }
    // Synchronously update MergedOpenKeys
    if (isInlineMode) {
      setMergedOpenKeys(inlineCacheOpenKeys);
    } else {
      // Trigger open event in case its in control
      triggerOpenKeys(EMPTY_LIST);
    }
  }, [mergedMode, mergedInlineCollapsed]);

  // ====================== Responsive ======================
  const [lastVisibleIndex, setLastVisibleIndex] = React.useState(0);
  const allVisible =
    lastVisibleIndex >= childList.length - 1 ||
    internalMode !== 'horizontal' ||
    disabledOverflow;

  // Cache
  React.useEffect(() => {
    if (isInlineMode) {
      setInlineCacheOpenKeys(mergedOpenKeys);
    }
  }, [mergedOpenKeys]);

  React.useEffect(() => {
    mountRef.current = true;

    return () => {
      mountRef.current = false;
    };
  }, []);

  // ========================= Path =========================
  const {
    registerPath,
    unregisterPath,
    refreshOverflowKeys,

    isSubPathKey,
    getKeyPath,
    getKeys,
    getSubPathKeys,
  } = useKeyRecords();

  const registerPathContext = React.useMemo(
    () => ({ registerPath, unregisterPath }),
    [registerPath, unregisterPath],
  );

  const pathUserContext = React.useMemo(() => ({ isSubPathKey }), [
    isSubPathKey,
  ]);

  React.useEffect(() => {
    refreshOverflowKeys(
      allVisible
        ? EMPTY_LIST
        : childList
            .slice(lastVisibleIndex + 1)
            .map(child => child.key as string),
    );
  }, [lastVisibleIndex, allVisible]);

  // ======================== Active ========================
  const [mergedActiveKey, setMergedActiveKey] = useMergedState(
    activeKey || ((defaultActiveFirst && childList[0]?.key) as string),
    {
      value: activeKey,
    },
  );

  const onActive = useMemoCallback((key: string) => {
    setMergedActiveKey(key);
  });

  const onInactive = useMemoCallback(() => {
    setMergedActiveKey(undefined);
  });

  useImperativeHandle(ref, () => {
    return {
      list: containerRef.current,
      focus: options => {
        const keys = getKeys();
        const { elements, key2element, element2key } = refreshElements(
          keys,
          uuid,
        );
        const focusableElements = getFocusableElements(
          containerRef.current,
          elements,
        );

        const shouldFocusKey =
          mergedActiveKey ?? element2key.get(focusableElements[0]);

        const elementToFocus = key2element.get(shouldFocusKey);

        if (shouldFocusKey && elementToFocus) {
          elementToFocus?.focus?.(options);
        }
      },
    };
  });

  // ======================== Select ========================
  // >>>>> Select keys
  const [mergedSelectKeys, setMergedSelectKeys] = useMergedState(
    defaultSelectedKeys || [],
    {
      value: selectedKeys,

      // Legacy convert key to array
      postState: keys => {
        if (Array.isArray(keys)) {
          return keys;
        }

        if (keys === null || keys === undefined) {
          return EMPTY_LIST;
        }

        return [keys];
      },
    },
  );

  // >>>>> Trigger select
  const triggerSelection = (info: MenuInfo) => {
    if (selectable) {
      // Insert or Remove
      const { key: targetKey } = info;
      const exist = mergedSelectKeys.includes(targetKey);
      let newSelectKeys: string[];

      if (multiple) {
        if (exist) {
          newSelectKeys = mergedSelectKeys.filter(key => key !== targetKey);
        } else {
          newSelectKeys = [...mergedSelectKeys, targetKey];
        }
      } else {
        newSelectKeys = [targetKey];
      }

      setMergedSelectKeys(newSelectKeys);

      // Trigger event
      const selectInfo: SelectInfo = {
        ...info,
        selectedKeys: newSelectKeys,
      };

      if (exist) {
        onDeselect?.(selectInfo);
      } else {
        onSelect?.(selectInfo);
      }
    }

    // Whatever selectable, always close it
    if (!multiple && mergedOpenKeys.length && internalMode !== 'inline') {
      triggerOpenKeys(EMPTY_LIST);
    }
  };

  // ========================= Open =========================
  /**
   * Click for item. SubMenu do not have selection status
   */
  const onInternalClick = useMemoCallback((info: MenuInfo) => {
    onClick?.(warnItemProp(info));
    triggerSelection(info);
  });

  const onInternalOpenChange = useMemoCallback((key: string, open: boolean) => {
    let newOpenKeys = mergedOpenKeys.filter(k => k !== key);

    if (open) {
      newOpenKeys.push(key);
    } else if (internalMode !== 'inline') {
      // We need find all related popup to close
      const subPathKeys = getSubPathKeys(key);
      newOpenKeys = newOpenKeys.filter(k => !subPathKeys.has(k));
    }

    if (!isEqual(mergedOpenKeys, newOpenKeys, true)) {
      triggerOpenKeys(newOpenKeys, true);
    }
  });

  // ==================== Accessibility =====================
  const triggerAccessibilityOpen = (key: string, open?: boolean) => {
    const nextOpen = open ?? !mergedOpenKeys.includes(key);

    onInternalOpenChange(key, nextOpen);
  };

  const onInternalKeyDown = useAccessibility(
    internalMode,
    mergedActiveKey,
    isRtl,
    uuid,

    containerRef,
    getKeys,
    getKeyPath,

    setMergedActiveKey,
    triggerAccessibilityOpen,

    onKeyDown,
  );

  // ======================== Effect ========================
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // ======================= Context ========================
  const privateContext = React.useMemo(
    () => ({
      _internalRenderMenuItem,
      _internalRenderSubMenuItem,
    }),
    [_internalRenderMenuItem, _internalRenderSubMenuItem],
  );

  // ======================== Render ========================

  // >>>>> Children
  const wrappedChildList =
    internalMode !== 'horizontal' || disabledOverflow
      ? childList
      : // Need wrap for overflow dropdown that do not response for open
        childList.map((child, index) => (
          // Always wrap provider to avoid sub node re-mount
          <MenuContextProvider
            key={child.key}
            overflowDisabled={index > lastVisibleIndex}
          >
            {child}
          </MenuContextProvider>
        ));

  // >>>>> Container
  const container = (
    <Overflow
      id={id}
      ref={containerRef}
      prefixCls={`${prefixCls}-overflow`}
      component="ul"
      itemComponent={MenuItem}
      className={classNames(
        prefixCls,
        `${prefixCls}-root`,
        `${prefixCls}-${internalMode}`,
        className,
        {
          [`${prefixCls}-inline-collapsed`]: internalInlineCollapsed,
          [`${prefixCls}-rtl`]: isRtl,
        },
        rootClassName,
      )}
      dir={direction}
      style={style}
      role="menu"
      tabIndex={tabIndex}
      data={wrappedChildList}
      renderRawItem={node => node}
      renderRawRest={omitItems => {
        // We use origin list since wrapped list use context to prevent open
        const len = omitItems.length;

        const originOmitItems = len ? childList.slice(-len) : null;

        return (
          <SubMenu
            eventKey={OVERFLOW_KEY}
            title={overflowedIndicator}
            disabled={allVisible}
            internalPopupClose={len === 0}
            popupClassName={overflowedIndicatorPopupClassName}
          >
            {originOmitItems}
          </SubMenu>
        );
      }}
      maxCount={
        internalMode !== 'horizontal' || disabledOverflow
          ? Overflow.INVALIDATE
          : Overflow.RESPONSIVE
      }
      ssr="full"
      data-menu-list
      onVisibleChange={newLastIndex => {
        setLastVisibleIndex(newLastIndex);
      }}
      onKeyDown={onInternalKeyDown}
      {...restProps}
    />
  );
}
