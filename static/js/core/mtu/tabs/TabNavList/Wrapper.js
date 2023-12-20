import { TabPane } from "../TabPaneList/TabPane";
// import {TabNavList}

export function TabNavListWrapper({ renderTabBar, ...restProps }) {
  const { tabs } = React.useContext(TabContext);

  if (renderTabBar) {
    const tabNavBarProps = {
      ...restProps,
      // Legacy support. We do not use this actually
      panes: tabs.map(({ label, key, ...restTabProps }) => TabPane({ tab: label, key, tabKey: key, ...restTabProps })),
    };

    return renderTabBar(tabNavBarProps, TabNavList);
  }

  return <TabNavList {...restProps} />;
}

if (process.env.NODE_ENV !== "production") {
  TabNavListWrapper.displayName = "TabNavListWrapper";
}
