import isString from "../../../utils/type/isString"
import isHTMLNode from "../../../utils/type/isHTMLNode"
import isNumber from "../../../utils/type/isNumber"
import isBoolean from "../../../utils/type/isBoolean"

const TabNavListProps = {
  id: value=>isString(value),
  tabPosition: TabPosition,
  activeKey: value=>isString(value),
  rtl: boolean,
  animated?: AnimatedConfig,
  extra?: TabBarExtraContent,
  editable?: EditableConfig,
  moreIcon?: React.ReactNode,
  moreTransitionName?: string,
  mobile: boolean,
  tabBarGutter?: number,
  renderTabBar?: RenderTabBar,
  className?: string,
  style?: React.CSSProperties,
  locale?: TabsLocale,
  onTabClick: (activeKey: string, e: React.MouseEvent | React.KeyboardEvent) => void,
  onTabScroll?: OnTabScroll,
  children?: (node: React.ReactElement) => React.ReactElement,
  getPopupContainer?: (node: HTMLElement) => HTMLElement,
  popupClassName?: string,
  indicatorSize?: GetIndicatorSize,
  indicatorAlign?: 'start' | 'center' | 'end',
}