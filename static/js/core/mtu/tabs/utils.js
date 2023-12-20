export function genDataNodeKey(key) {
  return String(key).replace(/"/g, RC_TABS_DOUBLE_QUOTE);
}

export function getRemovable(
  // closable?: boolean,
  // closeIcon?: ReactNode,
  // editable?: EditableConfig,
  // disabled?: boolean,
  closable,
  closeIcon,
  editable,
  disabled,
) {
  if (
    // Only editable tabs can be removed
    !editable ||
    // Tabs cannot be removed when disabled
    disabled ||
    // closable is false
    closable === false ||
    // If closable is undefined, the remove button should be hidden when closeIcon is null or false
    (closable === undefined && (closeIcon === false || closeIcon === null))
  ) {
    return false;
  }
  return true;
}
