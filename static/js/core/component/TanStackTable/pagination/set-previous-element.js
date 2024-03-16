export function setPreviousElement(previousElement, tableApi) {
  // previousElement.disabled = !tableApi.getCanNextPage();
  previousElement.addEventListener("click", () => {
    tableApi.previousPage();
  });

  return previousElement;
}
