export default class CoreFeature {
  constructor(tabs) {
    this.tabs = tabs;
  }

  //////////////////////////////////////////
  /////////////// DataLoad /////////////////
  //////////////////////////////////////////

  reloadData(data, silent, columnsChanged) {
    return this.tabs.dataLoader.load(data, undefined, undefined, undefined, silent, columnsChanged);
  }

  //////////////////////////////////////////
  ///////////// Localization ///////////////
  //////////////////////////////////////////

  langText() {
    return this.tabs.modules.localize.getText(...arguments);
  }

  langBind() {
    return this.tabs.modules.localize.bind(...arguments);
  }

  langLocale() {
    return this.tabs.modules.localize.getLocale(...arguments);
  }

  //////////////////////////////////////////
  ////////// Inter Table Comms /////////////
  //////////////////////////////////////////

  commsConnections() {
    return this.tabs.modules.comms.getConnections(...arguments);
  }

  commsSend() {
    return this.tabs.modules.comms.send(...arguments);
  }

  //////////////////////////////////////////
  //////////////// Layout  /////////////////
  //////////////////////////////////////////

  layoutMode() {
    return this.tabs.modules.layout.getMode();
  }

  layoutRefresh(force) {
    return this.tabs.modules.layout.layout(force);
  }

  //////////////////////////////////////////
  /////////////// Event Bus ////////////////
  //////////////////////////////////////////

  subscribe() {
    return this.tabs.eventBus.subscribe(...arguments);
  }

  unsubscribe() {
    return this.tabs.eventBus.unsubscribe(...arguments);
  }

  subscribed(key) {
    return this.tabs.eventBus.subscribed(key);
  }

  subscriptionChange() {
    return this.tabs.eventBus.subscriptionChange(...arguments);
  }

  dispatch() {
    return this.tabs.eventBus.dispatch(...arguments);
  }

  chain() {
    return this.tabs.eventBus.chain(...arguments);
  }

  confirm() {
    return this.tabs.eventBus.confirm(...arguments);
  }

  dispatchExternal() {
    return this.tabs.externalEvents.dispatch(...arguments);
  }

  subscribedExternal(key) {
    return this.tabs.externalEvents.subscribed(key);
  }

  subscriptionChangeExternal() {
    return this.tabs.externalEvents.subscriptionChange(...arguments);
  }

  //////////////////////////////////////////
  //////////////// Options /////////////////
  //////////////////////////////////////////

  options(key) {
    return this.tabs.options[key];
  }

  setOption(key, value) {
    if (typeof value !== "undefined") {
      this.tabs.options[key] = value;
    }

    return this.tabs.options[key];
  }

  //////////////////////////////////////////
  /////////// Deprecation Checks ///////////
  //////////////////////////////////////////

  deprecationCheck(oldOption, newOption) {
    return this.tabs.deprecationAdvisor.check(oldOption, newOption);
  }

  deprecationCheckMsg(oldOption, msg) {
    return this.tabs.deprecationAdvisor.checkMsg(oldOption, msg);
  }

  deprecationMsg(msg) {
    return this.tabs.deprecationAdvisor.msg(msg);
  }
  //////////////////////////////////////////
  //////////////// Modules /////////////////
  //////////////////////////////////////////

  module(key) {
    return this.tabs.module(key);
  }
}
