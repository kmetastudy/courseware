import { Store } from "../../../../../../../shared/component/Store";

export const store = new Store({
  state: {
    selectedTabValue: "progress",
  },

  mutations: {
    SET_selectedTabValue(state, payload) {
      state.selectedTabValue = payload;
    },
  },
});
