export function setNextElement(nextElement, tableApi) {
  // nextElement.disabled = !tableApi.getCanNextPage();

  nextElement.addEventListener("click", () => {
    tableApi.nextPage();
  });

  return nextElement;
}
