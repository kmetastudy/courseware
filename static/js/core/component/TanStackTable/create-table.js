const { createTable: createTableApi } = TableCore;

export function createTable(options) {
  // Compose in the generic options to the user options.
  const resolvedOptions = {
    state: {}, // Dummy state
    onStateChange: () => {}, // noop
    renderFallbackValue: null,
    ...options,
  };

  // Create the table.
  const table = createTableApi(resolvedOptions);

  // Use the table's initial state.
  const state = table.initialState;

  // Compose the default state above with any user state. This will allow the user
  // to only control a subset of the state if desired.
  table.setOptions((prev) => ({
    ...prev,
    ...options,
    state: {
      ...state,
      ...options.state,
    },
    // Similarly, we'll maintain both our internal state and any user-provided state.
    onStateChange: (updater) => {
      if (typeof updater === "function") {
        table.options.state = updater(table.getState());
      } else {
        table.options.state = updater;
      }
      options.onStateChange?.(updater);
    },
  }));

  return table;
}
