import { isHTMLNode } from "../../utils/type";
import { removeChildNodes } from "../../utils/dom/";

const flexRender = (comp, props) => {
  if (typeof comp === "function") {
    return comp(props);
  }
  return comp;
};

export function renderTable({ tableElement, table, previousButton, nextButton }) {
  // Clean tableElement
  removeChildNodes(tableElement);
  // Create table elements
  const theadElement = document.createElement("thead");
  const tbodyElement = document.createElement("tbody");

  tableElement.appendChild(theadElement);
  tableElement.appendChild(tbodyElement);

  // Render table headers
  table.getHeaderGroups().forEach((headerGroup) => {
    const tr = document.createElement("tr");
    headerGroup.headers.forEach((header) => {
      const th = document.createElement("th");
      th.innerHTML = header.isPlaceholder ? "" : flexRender(header.column.columnDef.header, header.getContext());
      tr.appendChild(th);
    });
    theadElement.appendChild(tr);
  });

  // Render table rows for the current page
  table.getRowModel().rows.forEach((row) => {
    const tr = document.createElement("tr");
    row.getVisibleCells().forEach((cell) => {
      const td = document.createElement("td");
      td.innerHTML = flexRender(cell.column.columnDef.cell, cell.getContext());
      tr.appendChild(td);
    });
    tbodyElement.appendChild(tr);
  });

  // Should prev/next button disabled?
  if (isHTMLNode(previousButton)) {
    previousButton.disabled = !table.getCanPreviousPage();
  }

  if (isHTMLNode(nextButton)) {
    nextButton.disabled = !table.getCanNextPage();
  }

  return tableElement;
}
