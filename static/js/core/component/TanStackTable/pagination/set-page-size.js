/** @deprecated */
export function setPageSize(sizeElements, pageSizes, tableApi) {
  // const pageSizeSelect = document.createElement("select");
  // const pageSizeOptions = [5, 10, 20, 30, 40, 50];
  // pageSizeOptions.forEach((pageSize) => {
  //   const pageSizeOption = document.createElement("option");
  //   pageSizeOption.selected = tableApi.getState().pagination.pageSize === pageSize;
  //   pageSizeOption.value = pageSize.toString();
  //   pageSizeOption.textContent = `Show ${pageSize}`;
  //   pageSizeSelect.appendChild(pageSizeOption);
  // });
  // pageSizeSelect.onchange = (event) => {
  //   const newPageSize = Number(event.target.value);
  //   tableApi.setPageSize(newPageSize);
  // };
  // // Page information
  // const pageInformationElement = document.createElement("div");
  // pageInformationElement.innerHTML = `Showing ${tableApi.getRowModel().rows.length.toLocaleString()} of ${table
  //   .getRowCount()
  //   .toLocaleString()} Rows`;
  // // Table state
  // const stateElement = document.createElement("pre");
  // stateElement.innerHTML = JSON.stringify(tableApi.getState().pagination, null, 2);
  // return pageSizeSelect;
}
