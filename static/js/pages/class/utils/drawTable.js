import elem from "../../../core/utils/elem/elem";
import { isFunction, isString, isHTMLNode } from "../../../core/utils/type";
// https://blog.termian.dev/posts/tabstack-table-vanilla-js/
export function drawTable({ rootElement, tableModel }) {
  const tableElement = document.createElement("table");
  tableElement.classList.add("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  const tfoot = document.createElement("tfoot");

  thead.append(
    ...tableModel.getHeaderGroups().map((headerGroup) => {
      const rowElement = document.createElement("tr");
      rowElement.append(
        ...headerGroup.headers.map((header) => {
          const cellElement = document.createElement("th");
          const element = flexRender(header.column.columnDef.header, header.getContext());
          if (element) {
            if (isHTMLNode(element)) {
              cellElement.appendChild(element);
            } else {
              cellElement.innerHTML = element;
            }
          }
          return cellElement;
        }),
      );
      return rowElement;
    }),
  );
  //

  tbody.append(
    ...tableModel.getRowModel().rows.map((row) => {
      const rowElement = document.createElement("tr");
      rowElement.append(
        ...row.getVisibleCells().map((cell) => {
          const cellElement = document.createElement("td");
          const element = flexRender(cell.column.columnDef.cell, cell.getContext());
          if (element !== null || element !== undefined) {
            if (isHTMLNode(element)) {
              cellElement.appendChild(element);
            } else {
              cellElement.innerHTML = element;
            }
            cell.element = element;
          }
          return cellElement;
        }),
      );
      return rowElement;
    }),
  );

  tfoot.append(
    ...tableModel.getFooterGroups().map((footerGroup) => {
      const rowElement = document.createElement("tr");
      rowElement.append(
        ...footerGroup.headers.map((header) => {
          const cellElement = document.createElement("th");
          const element = flexRender(header.column.columnDef.footer, header.getContext());
          if (element) {
            if (isHTMLNode(element)) {
              cellElement.appendChild(element);
            } else {
              cellElement.innerHTML = element;
            }
          }
          return cellElement;
        }),
      );
      return rowElement;
    }),
  );

  // tableElement.append(thead, tbody, tfoot);
  tableElement.append(thead, tbody);
  // tableElement.id = rootElementId;
  rootElement.replaceWith(tableElement);
  return tableElement;

  function flexRender(renderer, context) {
    let element = isFunction(renderer) ? renderer(context) : renderer;
    return element;
  }
}
